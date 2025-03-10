import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {elementAsList, Utils} from "html-evaluate-utils/Utils";
import {CustomTimeout, getTimeoutTime} from "../../utils/CustomTimeout";
import {validate} from "../../utils/Validator";
import {directWitCall} from "../../wit/callWit";
import {
    directAutoClick, isOnFriendList,
    isOnIgnoreList, retrieveElementForLikeByRule, sleep,
    witMessageCallBack
} from "../../utils/CUtils";

const RepostClicker = inject("cfgState", "navigationState", "cfgPanelState",
    "timeOutState", "actorState", "ruleState")(
    observer(({
                  cfgState, navigationState, cfgPanelState,
                  timeOutState, actorState, ruleState
              }) => {

        let logging = false;
        let logPrefix = " RepostClicker";

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                let intervalTime = cfgState.systemCfg.cfg.linkedInLike.rootTimeout;
                //intervalTime = intervalTime + (cfgState.resetLike * 1000);
                cfgState.localInterval = setTimeout(executeWithInterval, intervalTime);
            };
            executeWithInterval().then();
            return () => {
                if(cfgState.localInterval){
                    clearInterval(cfgState.localInterval);
                }
            }
        }, [cfgState.reset]);

        const run = async () => {
            let cfg = cfgState.systemCfg.cfg.linkedInLike.repost;
            let root = cfgState.systemCfg.cfg.linkedInLike.root;
            logging = cfg.log;
            if (window.location.href.includes("http://localhost:8083")) {
                logging = true;
                actorState.resetAllInteracted();
            }
            navigationState.syncCurrentPageByWindowLocation("RepostClicker.run()")
            if (root.run && navigationState.nav.currentPage === navigationState.pages.feed) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.key);
                if (!hasActiveTimeOut && cfgState.userCfg.cfg.linkedInLike[cfg.key].run) {
                    timeOutState.clearTimeOutsByKey(cfg.key);
                    await clickByCfg(cfg, callback);
                }
            }
        }

        const clickByCfg = async (cfg, callback) => {
            let delay = getTimeoutTime(0, cfg);
            let elements = elementAsList(cfg.postsXPath);
            const userCfg = cfgState.userCfg.cfg.linkedInLike[cfg.key];
            if (elements && elements.snapshotLength > 0 && elements.snapshotLength < 100) {
                logging && console.log(logPrefix + "elements.snapshotLength: " + elements.snapshotLength);
                for (let i = 0; i < elements.snapshotLength; i++) {
                    await sleep(500);
                    logging && console.log(i + logPrefix + " BEGIN");
                    let element = elements.snapshotItem(i);
                    let elementXPath = Utils.getXPathByEl(element);

                    await sleep(500);
                    logging && console.log(i + logPrefix + " LOGIC if (!elementXPath");
                    if (!elementXPath) {
                        logging && console.log(i + logPrefix + " FALSE !elementXPath");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE elementXPath");

                    await sleep(500);
                    let button = Utils.getElByXPath(elementXPath + cfg.buttonXPath);
                    logging && console.log(i + logPrefix + " LOGIC is button");
                    if (!button) {
                        logging && console.log(i + logPrefix + " FALSE button not found");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE button");

                    await sleep(500);
                    let buttonXPath = Utils.getElementXPath(button);
                    logging && console.log(i + logPrefix + " LOGIC is buttonXPath");
                    if (!buttonXPath) {
                        logging && console.log(i + logPrefix + " FALSE buttonXPath not found");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE buttonXPath");

                    await sleep(500);
                    logging && console.log(i + logPrefix + " LOGIC is validate");
                    if (!button || !validate(button, cfg)) {
                        logging && console.log(i + logPrefix + " FALSE not validate");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE validate")

                    await sleep(500);
                    logging && console.log(i + logPrefix + " LOGIC is cfg.wit.ruleSet set");
                    if (!userCfg.wit.ruleSet) {
                        logging && console.log(i + logPrefix + " FALSE cfg.wit.ruleSet not set");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE cfg.wit.ruleSet set");

                    await sleep(500);
                    let elHoldText = retrieveElementForLikeByRule(cfg, buttonXPath, ruleState, actorState);
                    logging && console.log(i + logPrefix + " LOGIC is elHoldText set");
                    if (!elHoldText) {
                        logging && console.log(i + logPrefix + " FALSE elHoldText not found");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE elHoldText found");

                    await sleep(500);
                    logging && console.log(i + logPrefix + " LOGIC is hasInteracted");
                    if (!elHoldText || actorState.hasInteracted(elHoldText.innerText, cfg.key)) {
                        logging && console.log(i + " FALSE hasInteracted, text " + elHoldText.innerText);
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE not hasInteracted, text: " + elHoldText.innerText);

                    await sleep(500);
                    logging && console.log(i + logPrefix + " LOGIC isOnIgnoreList");
                    if (isOnIgnoreList(button, userCfg, actorState)) {
                        logging && console.log(i + logPrefix + " FALSE isOnIgnoreList");
                        continue;
                    }
                    logging && console.log(i + logPrefix + " TRUE not onIgnoreList");

                    await sleep(500);
                    logging && console.log(i + logPrefix + " LOGIC isOnFriendList");
                    if (!isOnFriendList(button, userCfg, actorState) && userCfg.wit.run) {
                        logging && console.log(i + logPrefix + " TRUE not onFriendList");

                        await sleep(500);
                        let likeCounter = actorState.getActorLikeCounter(buttonXPath, cfg);
                        logging && console.log(i + logPrefix + " LOGIC if !likeCounter || likeCounter <= userCfg.likeCounterValue");
                        if (!likeCounter || likeCounter <= userCfg.likeCounterValue) {
                            logging && console.log(i + logPrefix + " FALSE likeCounter <= " + likeCounter);
                            continue;
                        }
                        logging && console.log(i + logPrefix + " TRUE likeCounter >= userCfg.likeCounterValue");

                        timeOutState.saveTimeOut(
                            new CustomTimeout(
                                callWitAi,
                                delay,
                                elHoldText.innerText,
                                button,
                                userCfg,
                                callback), cfg.key);
                        actorState.saveInteracted(elHoldText.innerText, cfg.key);
                    } else {
                        logging && console.log(i + logPrefix + " FALSE isOnFriendList");
                        timeOutState.saveTimeOut(
                            new CustomTimeout(
                                directAutoClick,
                                delay,
                                button,
                                userCfg,
                                callback), cfg.key);
                        actorState.saveInteracted(elHoldText.innerText, cfg.key);
                    }
                    delay = getTimeoutTime(delay, cfg);
                    logging && console.log(i + logPrefix + " END");
                }
                cfgState.resetLike++;
            }
        }

        const callWitAi = (textToWit, element, cfg, callback) => {
            logging && console.log("callWitAi textToWit: " + textToWit);
            directWitCall(textToWit, witMessageCallBack, element, cfg, callback, ruleState, 0, 0, "");
        }

        const callback = (result) => {
            logging && console.log("callback result: " + JSON.stringify(result));
            if (result.result) {
                cfgPanelState.updateBadge(result.key, cfgPanelState.badge[result.key] + 1);
            }
        }

    }));

export default RepostClicker;


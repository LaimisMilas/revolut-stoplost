import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {elementAsList, Utils} from "html-evaluate-utils/Utils";
import {CustomTimeout, getTimeoutTime} from "../../utils/CustomTimeout";
import {validate} from "../../utils/Validator";
import {directWitCall} from "../../wit/callWit";
import {
    directAutoClick,
    isOnFriendList,
    isOnIgnoreList,
    retrieveElementByRule, sleep, witMessageCallBack
} from "../../utils/CUtils";

const FollowClicker = inject("cfgState", "navigationState", "cfgPanelState",
    "timeOutState", "actorState", "ruleState")(
    observer(({cfgState, navigationState, cfgPanelState,
                  timeOutState, actorState, ruleState}) => {

        let logging = false;

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                const intervalTime = cfgState.systemCfg.cfg.linkedInLike.rootTimeout + (cfgState.resetLike * 1000);
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
            let cfg = cfgState.systemCfg.cfg.linkedInLike.follower;
            let root = cfgState.systemCfg.cfg.linkedInLike.root;
            logging = cfg.log;
            navigationState.syncCurrentPageByWindowLocation("FollowClicker.run()")
            if (root.run && navigationState.nav.currentPage === navigationState.pages.network) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.key);
                if (!hasActiveTimeOut && cfgState.userCfg.cfg.linkedInLike[cfg.key].run) {
                    timeOutState.clearTimeOutsByKey(cfg.key);
                    await clickByCfg(cfg, callback);
                }
            }
        }

        const clickByCfg = async (cfg, callback) => {
            let delay = getTimeoutTime(0, cfg);
            let elements = elementAsList(cfg.path);
            const userCfg = cfgState.userCfg.cfg.linkedInLike[cfg.key];
            if (elements && elements.snapshotLength > 0 && elements.snapshotLength < 100) {
                logging && console.log("elements.snapshotLength: " + elements.snapshotLength);
                for (let i = 0; i < elements.snapshotLength; i++) {
                    await sleep(500);
                    logging && console.log(i + " BEGIN");
                    let element = elements.snapshotItem(i);
                    logging && console.log(i + " LOGIC if (!element && !validate(element, cfg))");
                    if (!element || !validate(element, cfg)) {
                        logging && console.log(i + " FALSE if (!element && !validate(element, cfg)))");
                        continue;
                    }
                    let container = Utils.getElementXPath(element);
                    logging && console.log(i + " LOGIC if (!container");
                    if (!container) {
                        logging && console.log(i + " FALSE if (!container");
                        continue;
                    }
                    logging && console.log(i + " LOGIC if (!cfg.wit.ruleSet");
                    if (!userCfg.wit.ruleSet) {
                        logging && console.log(i + " FALSE if (!cfg.wit.ruleSet");
                        continue;
                    }
                    let elHoldText = retrieveElementByRule(cfg, container, ruleState, actorState);
                    await sleep(500);
                    logging && console.log(i + " LOGIC if (elHoldText && hasInteracted");
                    if (!elHoldText || actorState.hasInteracted(elHoldText.innerText, cfg.key)) {
                        logging && console.log(i + " FALSE if (!elHoldText && hasInteracted: " + elHoldText.innerText);
                        continue;
                    }
                    let textToWit = elHoldText.innerText;
                    await sleep(500);
                    logging && console.log(i + " LOGIC if (isNameOnIgnoreList");
                    if (isOnIgnoreList(element, userCfg, actorState)) {
                        logging && console.log(i + " FALSE if (isNameOnIgnoreList");
                        continue;
                    }
                    await sleep(500);
                    logging && console.log(i + " LOGIC  if (!isNameOnFriendList");
                    if (!isOnFriendList(element, userCfg, actorState) && userCfg.wit.run) {
                        logging && console.log(i + " TRUE  if (!isNameOnFriendList");
                        timeOutState.saveTimeOut(
                            new CustomTimeout(
                                callWitAi,
                                delay,
                                textToWit,
                                element,
                                userCfg,
                                callback), cfg.key);
                        actorState.saveInteracted(textToWit, cfg.key);
                    } else {
                        logging && console.log(i + " FALSE  if (!isNameOnFriendList");
                        timeOutState.saveTimeOut(
                            new CustomTimeout(
                                directAutoClick,
                                delay,
                                element,
                                userCfg,
                                callback), cfg.key);
                        actorState.saveInteracted(textToWit, cfg.key);
                    }
                    delay = getTimeoutTime(delay, cfg);
                    logging && console.log(i + " END");
                }
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

export default FollowClicker;


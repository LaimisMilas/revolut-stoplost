import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {elementAsList, Utils} from "html-evaluate-utils/Utils";
import {CustomTimeout, getTimeoutTime} from "../../utils/CustomTimeout";
import {validate} from "../../utils/Validator";
import {
    directAutoClick,
    isOnFriendList,
    isOnIgnoreList,
    retrieveElementByRule, witMessageCallBack
} from "../../utils/CUtils";
import {directWitCall} from "../../wit/callWit";

const LinkedInLike = inject("cfgState", "navigationState", "cfgPanelState", "authState","timeOutState","ruleState","actorState")(
    observer(({cfgState, navigationState, cfgPanelState, authState, timeOutState, ruleState,actorState}) => {

        let logging = false;

        const runAll = () => {
            let cfg = cfgState.systemCfg.cfg.linkedInLike;
            cfgPanelState.updateTimeDiff();
            if (cfgState.userCfg.cfg.linkedInLike.follower.run && navigationState.nav.currentPage === navigationState.pages.network) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.subscriber.key);
                if (!hasActiveTimeOut && cfgState.userCfg.cfg.linkedInLike.subscriber.run) {
                    timeOutState.clearTimeOutsByKey(cfg.subscriber);
                    clickByCfg(cfg.subscriber, callback);
                }
            }
            if (cfg.welcome.run && navigationState.nav.currentPage === navigationState.pages.feed) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.welcome.key);
                if (!hasActiveTimeOut && cfgState.userCfg.cfg.linkedInLike.welcome.run) {
                    timeOutState.clearTimeOutsByKey(cfg.welcome);
                    clickByCfg(cfg.welcome, callback);
                }
            }
        }

        const callback = (result) => {
            if (result.result) {
                cfgPanelState.updateBadge(result.key, cfgPanelState.badge[result.key] + 1);
            }
        }

        const callWitAi = (textToWit, element, cfg, callback) => {
            directWitCall(textToWit, witMessageCallBack, element, cfg, callback, ruleState, 0, 0, "");
        }

        const clickByCfg = (cfg, callback) => {
            let delay = getTimeoutTime(0, cfg);
            let elements = elementAsList(cfg.path);
            const userCfg = cfgState.userCfg.cfg.linkedInLike[cfg.key];
            if (elements && elements.snapshotLength > 0 && elements.snapshotLength < 100) {
                logging && console.log("elements.snapshotLength: " + elements.snapshotLength);
                for (let i = 0; i < elements.snapshotLength; i++) {
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
                    logging && console.log(i + " LOGIC if (elHoldText && hasInteracted");
                    if (!elHoldText || actorState.hasInteracted(elHoldText.innerText, cfg.key)) {
                        logging && console.log(i + " FALSE if (!elHoldText && hasInteracted: " + elHoldText.innerText);
                        continue;
                    }
                    let textToWit = elHoldText.innerText;
                    logging && console.log(i + " LOGIC if (isNameOnIgnoreList");
                    if (isOnIgnoreList(element, userCfg, actorState)) {
                        logging && console.log(i + " FALSE if (isNameOnIgnoreList");
                        continue;
                    }
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

        useEffect(() => {
            if (authState.user.uid && authState.user.uid !== 0) {
                cfgState.loadFromServiceByUserId(authState.user.uid, "LinkedInLike.useEffect() ");
            }
            setInterval(runAll, cfgState.systemCfg.cfg.linkedInLike.rootTimeout);
        }, [authState.user.uid]);

    }));

export default LinkedInLike;


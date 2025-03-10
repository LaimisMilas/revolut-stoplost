import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const StopLostClicker = inject("cfgState", "navigationState", "cfgPanelState",
    "timeOutState", "actorState", "ruleState")(
    observer(({
                  cfgState, navigationState, cfgPanelState,
                  timeOutState, actorState, ruleState
              }) => {

        let logging = false;
        let logPrefix = " StopLostClicker";

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                let intervalTime = cfgState.systemCfg.cfg.linkedInLike.rootTimeout;
                cfgState.localInterval = setTimeout(executeWithInterval, intervalTime);
            };
            executeWithInterval().then();
            return () => {
                if (cfgState.localInterval) {
                    clearInterval(cfgState.localInterval);
                }
            }
        }, [cfgState.reset]);

        const run = async () => {
            let cfg = cfgState.systemCfg.cfg.linkedInLike.like;
            let root = cfgState.systemCfg.cfg.linkedInLike.root;
            logging = cfg.log;
            if (window.location.href.includes("http://localhost:8083")) {
                logging = true;
                actorState.resetAllInteracted();
            }
            navigationState.syncCurrentPageByWindowLocation();
            if (root.run && navigationState.nav.currentPage === navigationState.pages.feed) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.key);
                if (!hasActiveTimeOut && cfgState.userCfg.cfg.linkedInLike[cfg.key].run) {
                    timeOutState.clearTimeOutsByKey(cfg.key);
                    await doClickLike(cfg, callback);
                }
            }
        }

        const doClickLike = async (cfg, callback) => {

        }

        const callback = (result) => {
            logging && console.log(logPrefix + " callback result: " + JSON.stringify(result));
            if (result.result) {
                cfgPanelState.updateBadge(result.key, cfgPanelState.badge[result.key] + 1);
            }
        }

    }));

export default StopLostClicker;


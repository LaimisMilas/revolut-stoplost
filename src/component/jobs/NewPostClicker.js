import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {Utils} from "html-evaluate-utils/Utils";
import {CustomTimeout, getTimeoutTime} from "../../utils/CustomTimeout";
import {
    directAutoClick,
} from "../../utils/CUtils";

const NewPostClicker = inject("cfgState", "navigationState", "cfgPanelState",
    "timeOutState")(
    observer(({cfgState, navigationState, cfgPanelState,
                  timeOutState}) => {

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
            let cfg = cfgState.systemCfg.cfg.linkedInLike.newPoster;
            let root = cfgState.systemCfg.cfg.linkedInLike.root;
            navigationState.syncCurrentPageByWindowLocation();
            if (root.run && navigationState.nav.currentPage === navigationState.pages.feed) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.key);
                if (!hasActiveTimeOut && cfgState.userCfg.cfg.linkedInLike[cfg.key].run) {
                    timeOutState.clearTimeOutsByKey(cfg.key);
                    await clickNewPost(cfg, callback);
                }
            }
        }

        const clickNewPost = async (cfg, callback) => {
                let delay = getTimeoutTime(0, cfg);
                let element = Utils.getElByXPath(cfg.path);
                if (element) {
                    const userCfg = cfgState.userCfg.cfg.linkedInLike[cfg.key];
                    timeOutState.saveTimeOut(
                        new CustomTimeout(directAutoClick.bind(this), delay, element, userCfg, callback), cfg.key);
                }
        }

        const callback = (result) => {
            if (result.result) {
                cfgPanelState.updateBadge(result.key, cfgPanelState.badge[result.key] + 1);
            }
        }

    }));

export default NewPostClicker;


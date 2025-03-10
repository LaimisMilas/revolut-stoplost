import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {Utils} from "html-evaluate-utils/Utils";
import {CustomTimeout} from "../../utils/CustomTimeout";

const SiteNavigation =  inject("cfgState", "navigationState","timeOutState")(
    observer(({cfgState, navigationState, timeOutState}) => {

    useEffect(() => {
        const executeWithInterval = async () => {
            await run();
            const intervalTime = navigationState.nav.rootTimeout;
            navigationState.nav.rootInterval = setTimeout(executeWithInterval, intervalTime);

        };
        executeWithInterval().then();
        return () => {
            if(navigationState.nav.rootInterval){
                clearInterval(navigationState.nav.rootInterval);
            }
        }
    }, []);

    const run = async () => {
        navigationState.syncCurrentPageByWindowLocation();
        let cfg = navigationState.getCurrentPageNavCfg();
        let root = cfgState.systemCfg.cfg.linkedInLike.root;
        if (root.run) {
            let hasActiveTimeOut = timeOutState.hasActiveTimeOut("navigation");
            if (!hasActiveTimeOut) {
                timeOutState.clearTimeOutsByKey("navigation");
                await siteNav(cfg);
            }
        }
    };

    const siteNav = async (cfg) => {
        let delay = Utils.getRandomValue(cfg.timeOnPage);
        timeOutState.saveTimeOut(
            new CustomTimeout(navigationState.changePath.bind([navigationState, timeOutState]), delay, cfg), "navigation");
    }

}));

export default SiteNavigation;
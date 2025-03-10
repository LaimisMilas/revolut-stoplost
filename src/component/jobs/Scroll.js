import {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import { Utils} from "html-evaluate-utils/Utils";
import {CustomTimeout} from "../../utils/CustomTimeout";

const Scroll = inject("cfgState", "timeOutState","scrollState", "navigationState")(
    observer(({cfgState, timeOutState, scrollState, navigationState}) => {

    useEffect(() => {
        const executeWithInterval = async () => {
            await run();
            const intervalTime = scrollState.cfg.rootTimeout;
            scrollState.cfg.rootInterval = setTimeout(executeWithInterval, intervalTime);
        };
        executeWithInterval().then();
        return () => {
            if(scrollState.cfg.rootInterval){
                clearInterval(scrollState.cfg.rootInterval);
            }
        }
    }, []);

    const run = async () => {
        let cfg = scrollState.cfg;
        let root = cfgState.systemCfg.cfg.linkedInLike.root;
        if (root.run) {
            let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.scroll.key);
            if (!hasActiveTimeOut && cfg.scroll.run) {
                timeOutState.clearTimeOutsByKey(cfg.scroll.key);
                await runScroll(cfg);
            }
        }
    }

    const runScroll = async (cfg) => {
        let delay = Utils.getRandomValue(cfg.root.range);
        timeOutState.saveTimeOut(
            new CustomTimeout(scrollState.scrollDown, delay, cfg, navigationState), cfg.scroll.key);
    };

}));
export default Scroll;

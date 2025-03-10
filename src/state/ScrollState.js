import {makeAutoObservable} from 'mobx';
import {TimeoutStatus} from "../utils/CustomTimeout";
import {lc_scroller_cfg} from "clicker-common/src/staticData/lc_scroller_Cfg";
import {Utils} from "html-evaluate-utils/Utils";

export class ScrollState {
    
    cfg = null;
    stopAllAction = false;
    currentTimeOut = {status:TimeoutStatus.COMPLETED};

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, caller) {
        this.rootStore = rootStore;
        this.setScrollerCfg(lc_scroller_cfg);
    }
    
    setScrollerCfg(cfg){
        this.cfg = cfg;
    }

    scrollDown(cfg, navigationState){
        let down = Utils.getRandomValue(cfg.scroll.scrollerDown);
        if(navigationState.nav.currentPage === "network"){
            let scrollNetwork = Utils.getElByXPath("//main/../../..");
            scrollNetwork.scrollBy({
                top: down,
                left: 0,
                behavior: "smooth",
            });
        } else {
            window.scrollBy({top: down, left: 0, behavior: 'smooth'});
        }
    }
}
import {makeAutoObservable} from 'mobx';
import {TimeoutStatus} from "../utils/CustomTimeout";
import {lc_buy_cfg} from "../static/lc_buy_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";

export class BuyState {

    rootStore = null;
    authState = null;
    cfgPanelState = null;
    userCfg = null;
    systemCfg = null;
    stopAllAction = false;
    currentTimeOut = {status: TimeoutStatus.COMPLETED};
    intervalGetCfg = null;
    intervalGetSystemCfg = null;
    resetLike = 0;
    resetRePost = 0;
    localInterval;
    rePostInterval;
    intervalGetCfgTimeOut = 11100;
    intervalGetSystemCfgTimeOut = 12200;
    updateSystemCfg = true;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, authState, cfgPanelState) {
        this.rootStore = rootStore;
        this.authState = authState;
        this.cfgPanelState = cfgPanelState;
        this.setUserCfg(lc_buy_cfg);
        this.setSystemCfg(lc_system_cfg);
    }

    setUserCfg(rootCfg){
        this.userCfg = rootCfg;
    }

    setRunEntityCfg(key, value){
        this.userCfg.cfg.linkedInLike[key].value = value;
    }

    setSystemCfg(systemCfg){
        this.systemCfg = systemCfg;
    }

    save(updatedCfg, uid, caller) {
        if(uid === 0){
            this.rootStore.saveStorage();
        }
    }
}

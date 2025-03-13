import {makeAutoObservable} from 'mobx';
import {TimeoutStatus} from "../utils/CustomTimeout";
import {lc_user_cfg, trade_pares} from "../static/lc_user_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";

export class StopLostState {

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
    tradePares = null;

    constructor() {
        makeAutoObservable(this);
    }

    getTradePareDataByKey(key){
        return this.tradePares[key];
    }

    saveTradePareData(key, tradeDate){
        let data = this.getTradePareDataByKey(key);
        if(data){
            data.stopLost = tradeDate.stopLost;
            data.takeProf = tradeDate.takeProf;
            data.takeProfRsi = tradeDate.takeProfRsi;
            data.price = tradeDate.price;
            this.tradePares.add(tradeDate);
        } else {
            this.tradePares.add(key, tradeDate);
        }
        return this.getTradePareDataByKey(key);
    }

    setup(rootStore, authState, cfgPanelState) {
        this.rootStore = rootStore;
        this.authState = authState;
        this.cfgPanelState = cfgPanelState;
        this.setUserCfg(lc_user_cfg);
        this.setSystemCfg(lc_system_cfg);
        this.setTradePares(trade_pares);
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

    setTradePares(tradePares){
        this.tradePares = tradePares;
    }

    save(updatedCfg, uid, caller) {
        if(uid === 0){
            this.rootStore.saveStorage();
        }
    }
}

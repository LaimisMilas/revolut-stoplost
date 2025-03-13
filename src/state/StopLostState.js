import {makeAutoObservable} from 'mobx';
import {TimeoutStatus} from "../utils/CustomTimeout";
import {lc_user_cfg, trade_pares} from "../static/lc_user_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";

export class StopLostState {

    rootStore = null;
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

    setup(rootStore, cfgPanelState) {
        this.rootStore = rootStore;
        this.cfgPanelState = cfgPanelState;
        this.setUserCfg(lc_user_cfg);
        this.setSystemCfg(lc_system_cfg);
        this.setTradePares(trade_pares);
    }

    getTradePareDataByKey(key){
        return this.tradePares[key];
    }

    saveTradePareData(tradeDate){
        let data = this.getTradePareDataByKey(tradeDate.key);
        if(data){
            data.stopLost = tradeDate.stopLost;
            data.takeProf = tradeDate.takeProf;
            data.takeProfRsi = tradeDate.takeProfRsi;
            data.price = tradeDate.price;
            this.tradePares[tradeDate.key] = data;
        } else {
            this.tradePares[tradeDate.key] = tradeDate;
        }
        this.rootStore.saveStorage();
        return this.getTradePareDataByKey(tradeDate.key);
    }

    setUserCfg(rootCfg){
        this.userCfg = rootCfg;
    }

    setSystemCfg(systemCfg){
        this.systemCfg = systemCfg;
    }

    setTradePares(tradePares){
        this.tradePares = tradePares;
    }
}

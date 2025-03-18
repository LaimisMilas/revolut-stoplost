import {makeAutoObservable} from 'mobx';
import {lc_sell_cfg, trade_pares} from "../static/lc_sell_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";

export class SellState {

    rootStore = null;
    sellPanelState = null;
    sellCfg = null;
    systemCfg = null;
    stopAllAction = false;
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
    currentTradePare  = null;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, sellPanelState) {
        this.rootStore = rootStore;
        this.sellPanelState = sellPanelState;
        this.setSellCfg(lc_sell_cfg);
        this.setSystemCfg(lc_system_cfg);
        this.setTradePares(trade_pares);
    }

    getCurrentTradePare(){
        return this.currentTradePare;
    }

    setCurrentTradePare(tradePares){
        this.currentTradePare  = tradePares;
    }

    getTradePareDataByKey(key){
        if(this.tradePares[key]){
            this.setCurrentTradePare(this.tradePares[key]);
        }
        return this.getCurrentTradePare();
    }

    saveTradePareData(tradeDate){
        let data = this.getTradePareDataByKey(tradeDate.key);
        if(data){
            data.stopLost = tradeDate.stopLost;
            data.takeProf = tradeDate.takeProf;
            data.takeProfRsi = tradeDate.takeProfRsi;
            data.price = tradeDate.price;
            data.quantity = tradeDate.quantity;
            this.tradePares[tradeDate.key] = data;
        } else {
            this.tradePares[tradeDate.key] = tradeDate;
        }
        this.rootStore.saveStorage();
        return this.getTradePareDataByKey(tradeDate.key);
    }

    setSellCfg(cfg){
        this.sellCfg = cfg;
    }

    setSystemCfg(systemCfg){
        this.systemCfg = systemCfg;
    }

    setTradePares(tradePares){
        this.tradePares = tradePares;
    }
}

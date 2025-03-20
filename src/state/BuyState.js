import {makeAutoObservable} from 'mobx';
import {lc_buy_cfg} from "../static/lc_buy_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";
import {trade_pares} from "../static/lc_buy_cfg";

export class BuyState {

    rootStore = null;
    authState = null;
    buyPanelState = null;
    buyCfg = null;
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
    aspectCorrelation = 0.50;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, authState, buyPanelState) {
        this.rootStore = rootStore;
        this.authState = authState;
        this.buyPanelState = buyPanelState;
        this.setBuyCfg(lc_buy_cfg);
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
            data.targetPrice = tradeDate.targetPrice;
            data.takeProfRsi = tradeDate.takeProfRsi;
            data.quantity = tradeDate.quantity;
            this.tradePares[tradeDate.key] = data;
        } else {
            this.tradePares[tradeDate.key] = tradeDate;
        }
        this.rootStore.saveStorage();
        return this.getTradePareDataByKey(tradeDate.key);
    }

    setBuyCfg(cfg){
        this.buyCfg = cfg;
    }

    setSystemCfg(systemCfg){
        this.systemCfg = systemCfg;
    }

    setTradePares(tradePares){
        this.tradePares = tradePares;
    }
}

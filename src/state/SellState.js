import {makeAutoObservable} from 'mobx';
import {trade_pares} from "../static/lc_sell_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";

export class SellState {

    rootStore = null;
    sellPanelState = null;
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
    aspectCorrelation = -0.50;
    msgs = [];
    countTrySell = 0;
    trySellPrices = [];
    position = {
        entry: 0,
        stop:0,
        target: 0,
        timestamp: 0
    };
    orders = [];

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, sellPanelState) {
        this.rootStore = rootStore;
        this.sellPanelState = sellPanelState;
        this.setSystemCfg(lc_system_cfg);
        this.setTradePares(trade_pares);
    }

    getPosition(){
        return this.position;
    }

    setPosition(position){
        this.position = position;
    }

    pushOrder(order){
        this.orders.push(order);
        if(this.orders.length > 50){
            this.orders = this.orders.slice(-50);
        }
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
            data.aspectCorrelation = tradeDate.aspectCorrelation;
            this.tradePares[tradeDate.key] = data;
        } else {
            this.tradePares[tradeDate.key] = tradeDate;
        }
        this.rootStore.saveStorage();
        return this.getTradePareDataByKey(tradeDate.key);
    }

    setSystemCfg(systemCfg){
        this.systemCfg = systemCfg;
    }

    setTradePares(tradePares){
        this.tradePares = tradePares;
    }

    saveMsg(msg){
        this.msgs.push(msg);
    }
}

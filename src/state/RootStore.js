import {StopLostState} from './StopLostState';
import {CfgPanelState} from './CfgPanelState';
import {LocalStorageManager} from "../storage/LocalStorageManager";
import {SessionStorageManager} from "../storage/SessionStorageManager";
import {BuyState} from "./BuyState";
import {CfgBuyPanelState} from "./CfgBuyPanelState";
import {IndicatorReadState} from "./IndicatorReadState";
export class RootStore {

    stopLostState = null;
    buyState = null;
    cfgPanelState = null;
    cfgBuyPanelState = null;
    indicatorReadState = null;
    prefix = "lc_";

    constructor() {
        this.stopLostState = new StopLostState();
        this.buyState = new BuyState();
        this.cfgPanelState = new CfgPanelState();
        this.cfgBuyPanelState = new CfgBuyPanelState();
        this.indicatorReadState = new IndicatorReadState();
        this.setupStoreRelationships(" RootStore.constructor()");
    }

    setupStoreRelationships(caller) {
        this.stopLostState.setup(this, this.cfgPanelState);
        this.buyState.setup(this, this.cfgBuyPanelState);
        this.cfgPanelState.setup(this, this.stopLostState);
        this.cfgBuyPanelState.setup(this, this.buyState);
        this.indicatorReadState.setup(this);

        const storeState = LocalStorageManager.getStorage("lc_store_state");
        if (storeState && storeState === 1) {
            this.reverseLoudLocalStorage(caller);
        } else {
            this.initializeLocalStorage(caller);
        }
        this.setIntervalSaveStorage(" RootStore.setupStoreRelationships() end, caller:" + caller);
    }

    intervalSaveStorageTimeOut = 30000;
    intervalSaveStorage = null;
    setIntervalSaveStorage(){
        this.intervalSaveStorage = setInterval(
            this.saveStorage.bind(this),
            this.intervalSaveStorageTimeOut,
            "RootStore.setIntervalSaveStorage()");
    }

    loudLocalStorage() {
        /** gražinamas rezultatas yra JSON formatu, parsinamas iš string objekto */
        this.stopLostState.userCfg = {...LocalStorageManager.getStorage("lc_cfg"), ...this.stopLostState.userCfg};
        this.stopLostState.systemCfg = {...LocalStorageManager.getStorage("lc_systemCfg"), ...this.stopLostState.systemCfg};
        this.stopLostState.tradePares = {...LocalStorageManager.getStorage("lc_tradePares"), ...this.stopLostState.tradePares};
        this.buyState.tradePares = {...LocalStorageManager.getStorage("lc_buy_tradePares"), ...this.buyState.tradePares};
        this.buyState.userCfg = {...LocalStorageManager.getStorage("lc_buy_cfg"), ...this.buyState.userCfg};
        this.buyState.systemCfg = {...LocalStorageManager.getStorage("lc_buy_systemCfg"), ...this.buyState.systemCfg};
        this.cfgPanelState.rowConfig = {...LocalStorageManager.getStorage("lc_rowConfig"), ...this.cfgPanelState.rowConfig};
        this.cfgBuyPanelState.rowConfig = {...LocalStorageManager.getStorage("lc_buy_rowConfig"), ...this.cfgBuyPanelState.rowConfig};
        this.indicatorReadState.last100RSIValue = this.reduce(LocalStorageManager.getStorage("lc_last100RSIValue"), this.indicatorReadState.last100RSIValue);
        this.indicatorReadState.last100PriceValue = this.reduce(LocalStorageManager.getStorage("lc_last100PriceValue"), this.indicatorReadState.last100PriceValue);
    }
    reduce(acc, bcc){
        return acc.concat(bcc);
    }

    reverseLoudLocalStorage() {
        /** gražinamas rezultatas yra JSON formatu, parsinamas iš string objekto */
        this.stopLostState.userCfg = {...this.stopLostState.userCfg, ...LocalStorageManager.getStorage("lc_cfg")};
        this.stopLostState.systemCfg = {...this.stopLostState.systemCfg, ...LocalStorageManager.getStorage("lc_systemCfg")};
        this.stopLostState.tradePares = {...this.stopLostState.tradePares, ...LocalStorageManager.getStorage("lc_tradePares")};
        this.buyState.tradePares = {...this.buyState.tradePares, ...LocalStorageManager.getStorage("lc_buy_tradePares")};
        this.buyState.userCfg = {...this.buyState.userCfg, ...LocalStorageManager.getStorage("lc_buy_cfg")};
        this.buyState.systemCfg = {...this.buyState.systemCfg, ...LocalStorageManager.getStorage("lc_buy_systemCfg")};
        this.cfgPanelState.rowConfig = {...this.cfgPanelState.rowConfig, ...LocalStorageManager.getStorage("lc_rowConfig")};
        this.cfgBuyPanelState.rowConfig = {...this.cfgBuyPanelState.rowConfig, ...LocalStorageManager.getStorage("lc_buy_rowConfig")};
        this.indicatorReadState.last100RSIValue = this.reduce(this.indicatorReadState.last100RSIValue, LocalStorageManager.getStorage("lc_last100RSIValue"));
        this.indicatorReadState.last100PriceValue = this.reduce(this.indicatorReadState.last100PriceValue, LocalStorageManager.getStorage("lc_last100PriceValue"));
    }

    saveStorage() {
        LocalStorageManager.flash("lc_cfg", this.stopLostState.userCfg);
        LocalStorageManager.flash("lc_systemCfg", this.stopLostState.systemCfg);
        LocalStorageManager.flash("lc_tradePares", this.stopLostState.tradePares);
        LocalStorageManager.flash("lc_buy_tradePares", this.buyState.tradePares);
        LocalStorageManager.flash("lc_buy_cfg", this.buyState.userCfg);
        LocalStorageManager.flash("lc_buy_systemCfg", this.buyState.systemCfg);
        LocalStorageManager.flash("lc_rowConfig", this.cfgPanelState.rowConfig);
        LocalStorageManager.flash("lc_buy_rowConfig", this.cfgBuyPanelState.rowConfig);
        LocalStorageManager.flash("lc_store_state", 1);
        LocalStorageManager.flash("lc_last100RSIValue", this.indicatorReadState.last100RSIValue);
        LocalStorageManager.flash("lc_last100PriceValue", this.indicatorReadState.last100PriceValue);
      }


    initializeLocalStorage() {
        LocalStorageManager.flash("lc_cfg", this.stopLostState.userCfg);
        LocalStorageManager.flash("lc_systemCfg", this.stopLostState.systemCfg);
        LocalStorageManager.flash("lc_tradePares", this.stopLostState.tradePares);
        LocalStorageManager.flash("lc_buy_tradePares", this.buyState.tradePares);
        LocalStorageManager.flash("lc_buy_cfg", this.buyState.userCfg);
        LocalStorageManager.flash("lc_buy_systemCfg", this.buyState.systemCfg);
        LocalStorageManager.flash("lc_rowConfig", this.cfgPanelState.rowConfig);
        LocalStorageManager.flash("lc_buy_rowConfig", this.cfgBuyPanelState.rowConfig);
        LocalStorageManager.flash("lc_store_state", 1);
        LocalStorageManager.flash("lc_last100RSIValue", this.indicatorReadState.last100RSIValue);
        LocalStorageManager.flash("lc_last100PriceValue", this.indicatorReadState.last100PriceValue);
    }

    deleteAllData() {
        LocalStorageManager.removeStorageItem("lc_store_state");
        LocalStorageManager.removeStorageItem("lc_cfg");
        LocalStorageManager.removeStorageItem("lc_systemCfg");
        LocalStorageManager.removeStorageItem("lc_buy_cfg");
        LocalStorageManager.removeStorageItem("lc_buy_systemCfg");
        LocalStorageManager.removeStorageItem("lc_rowConfig");
        LocalStorageManager.removeStorageItem("lc_buy_rowConfig");
        LocalStorageManager.removeStorageItem("lc_store_state");
        LocalStorageManager.removeStorageItem("lc_tradePares");
        LocalStorageManager.removeStorageItem("lc_buy_tradePares");
        LocalStorageManager.removeStorageItem("lc_last100RSIValue");
        LocalStorageManager.removeStorageItem("lc_last100PriceValue");
    }
}

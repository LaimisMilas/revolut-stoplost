import {SellState} from './SellState';
import {SellPanelState} from './SellPanelState';
import {LocalStorageManager} from "../storage/LocalStorageManager";
import {BuyState} from "./BuyState";
import {BuyPanelState} from "./BuyPanelState";
import {IndicatorReadState} from "./IndicatorReadState";
export class RootStore {

    sellState = null;
    buyState = null;
    sellPanelState = null;
    buyPanelState = null;
    indicatorReadState = null;
    prefix = "lc_";

    constructor() {
        this.sellState = new SellState();
        this.buyState = new BuyState();
        this.sellPanelState = new SellPanelState();
        this.buyPanelState = new BuyPanelState();
        this.indicatorReadState = new IndicatorReadState();
        this.setupStoreRelationships(" RootStore.constructor()");
    }

    setupStoreRelationships(caller) {
        this.sellState.setup(this, this.sellPanelState);
        this.buyState.setup(this, this.buyPanelState);
        this.sellPanelState.setup(this, this.sellState);
        this.buyPanelState.setup(this, this.buyState);
        this.indicatorReadState.setup(this);
        this.addToStoreRegister();
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
        this.sellState.userCfg = {...LocalStorageManager.getStorage("lc_cfg"), ...this.sellState.userCfg};
        this.sellState.systemCfg = {...LocalStorageManager.getStorage("lc_systemCfg"), ...this.sellState.systemCfg};
        this.sellState.tradePares = {...LocalStorageManager.getStorage("lc_sell_tradePares"), ...this.sellState.tradePares};
        this.buyState.tradePares = {...LocalStorageManager.getStorage("lc_buy_tradePares"), ...this.buyState.tradePares};
        this.buyState.userCfg = {...LocalStorageManager.getStorage("lc_buy_cfg"), ...this.buyState.userCfg};
        this.buyState.systemCfg = {...LocalStorageManager.getStorage("lc_buy_systemCfg"), ...this.buyState.systemCfg};
        this.sellPanelState.rowConfig = {...LocalStorageManager.getStorage("lc_rowConfig"), ...this.sellPanelState.rowConfig};
        this.buyPanelState.rowConfig = {...LocalStorageManager.getStorage("lc_buy_rowConfig"), ...this.buyPanelState.rowConfig};
        this.indicatorReadState.last100RSIValue = this.reduce(LocalStorageManager.getStorage("lc_last100RSIValue"), this.indicatorReadState.last100RSIValue);
        this.indicatorReadState.last100PriceValue = this.reduce(LocalStorageManager.getStorage("lc_last100PriceValue"), this.indicatorReadState.last100PriceValue);
        this.indicatorReadState.last1kRSIValue = this.reduce(LocalStorageManager.getStorage("lc_last1kRSIValue"), this.indicatorReadState.last1kRSIValue);
        this.buyState.aspectCorrelation = LocalStorageManager.getStorage("lc_buy_aspectCorrelation");
        this.sellState.aspectCorrelation = LocalStorageManager.getStorage("lc_sel_aspectCorrelation");
        this.sellState.msgs = this.reduce(LocalStorageManager.getStorage("lc_sell_msgs"), this.sellState.msgs);
        this.buyState.msgs = this.reduce(LocalStorageManager.getStorage("lc_buy_msgs"), this.buyState.msgs);
    }
    reduce(acc, bcc){
        return acc.concat(bcc);
    }

    reverseLoudLocalStorage() {
        /** gražinamas rezultatas yra JSON formatu, parsinamas iš string objekto */
        this.sellState.userCfg = {...this.sellState.userCfg, ...LocalStorageManager.getStorage("lc_cfg")};
        this.sellState.systemCfg = {...this.sellState.systemCfg, ...LocalStorageManager.getStorage("lc_systemCfg")};
        this.sellState.tradePares = {...this.sellState.tradePares, ...LocalStorageManager.getStorage("lc_sell_tradePares")};
        this.buyState.tradePares = {...this.buyState.tradePares, ...LocalStorageManager.getStorage("lc_buy_tradePares")};
        this.buyState.userCfg = {...this.buyState.userCfg, ...LocalStorageManager.getStorage("lc_buy_cfg")};
        this.buyState.systemCfg = {...this.buyState.systemCfg, ...LocalStorageManager.getStorage("lc_buy_systemCfg")};
        this.sellPanelState.rowConfig = {...this.sellPanelState.rowConfig, ...LocalStorageManager.getStorage("lc_rowConfig")};
        this.buyPanelState.rowConfig = {...this.buyPanelState.rowConfig, ...LocalStorageManager.getStorage("lc_buy_rowConfig")};
        this.indicatorReadState.last100RSIValue = this.reduce(this.indicatorReadState.last100RSIValue, LocalStorageManager.getStorage("lc_last100RSIValue"));
        this.indicatorReadState.last100PriceValue = this.reduce(this.indicatorReadState.last100PriceValue, LocalStorageManager.getStorage("lc_last100PriceValue"));
        this.indicatorReadState.last1kRSIValue = this.reduce(this.indicatorReadState.last1kRSIValue, LocalStorageManager.getStorage("lc_last1kRSIValue"));
        this.buyState.aspectCorrelation = LocalStorageManager.getStorage("lc_buy_aspectCorrelation");
        this.sellState.aspectCorrelation = LocalStorageManager.getStorage("lc_sell_aspectCorrelation");
        this.sellState.msgs = this.reduce(this.sellState.msgs, LocalStorageManager.getStorage("lc_sell_msgs"));
        this.buyState.msgs = this.reduce(this.buyState.msgs, LocalStorageManager.getStorage("lc_buy_msgs"));
    }

    saveStorage() {
        LocalStorageManager.flash("lc_cfg", this.sellState.userCfg);
        LocalStorageManager.flash("lc_systemCfg", this.sellState.systemCfg);
        LocalStorageManager.flash("lc_sell_tradePares", this.sellState.tradePares);
        LocalStorageManager.flash("lc_buy_tradePares", this.buyState.tradePares);
        LocalStorageManager.flash("lc_buy_cfg", this.buyState.userCfg);
        LocalStorageManager.flash("lc_buy_systemCfg", this.buyState.systemCfg);
        LocalStorageManager.flash("lc_rowConfig", this.sellPanelState.rowConfig);
        LocalStorageManager.flash("lc_buy_rowConfig", this.buyPanelState.rowConfig);
        LocalStorageManager.flash("lc_store_state", 1);
        LocalStorageManager.flash("lc_last100RSIValue", this.indicatorReadState.last100RSIValue);
        LocalStorageManager.flash("lc_last100PriceValue", this.indicatorReadState.last100PriceValue);
        LocalStorageManager.flash("lc_last1kRSIValue", this.indicatorReadState.last1kRSIValue);
        LocalStorageManager.flash("lc_buy_aspectCorrelation", this.buyState.aspectCorrelation);
        LocalStorageManager.flash("lc_sell_aspectCorrelation", this.sellState.aspectCorrelation);
        LocalStorageManager.flash("lc_sell_msgs", this.sellState.msgs);
        LocalStorageManager.flash("lc_buy_msgs", this.buyState.msgs);
      }

    initializeLocalStorage() {
        LocalStorageManager.flash("lc_cfg", this.sellState.userCfg);
        LocalStorageManager.flash("lc_systemCfg", this.sellState.systemCfg);
        LocalStorageManager.flash("lc_sell_tradePares", this.sellState.tradePares);
        LocalStorageManager.flash("lc_buy_tradePares", this.buyState.tradePares);
        LocalStorageManager.flash("lc_buy_cfg", this.buyState.userCfg);
        LocalStorageManager.flash("lc_buy_systemCfg", this.buyState.systemCfg);
        LocalStorageManager.flash("lc_rowConfig", this.sellPanelState.rowConfig);
        LocalStorageManager.flash("lc_buy_rowConfig", this.buyPanelState.rowConfig);
        LocalStorageManager.flash("lc_store_state", 1);
        LocalStorageManager.flash("lc_last100RSIValue", this.indicatorReadState.last100RSIValue);
        LocalStorageManager.flash("lc_last1kRSIValue", this.indicatorReadState.last1kRSIValue);
        LocalStorageManager.flash("lc_buy_aspectCorrelation", this.buyState.aspectCorrelation);
        LocalStorageManager.flash("lc_sell_aspectCorrelation", this.sellState.aspectCorrelation);
        LocalStorageManager.flash("lc_sell_msgs", this.sellState.msgs);
        LocalStorageManager.flash("lc_buy_msgs", this.buyState.msgs);
    }

    registryStoreObject = new Map();

    addToStoreRegister(){
        this.registryStoreObject.set("lc_cfg",{"obj": this.sellState.userCfg, "reduce": false});
        this.registryStoreObject.set("lc_systemCfg",{"obj": this.sellState.systemCfg, "reduce": false});
        this.registryStoreObject.set("lc_sell_tradePares",{"obj": this.sellState.tradePares, "reduce": false});
        this.registryStoreObject.set("lc_buy_tradePares",{"obj": this.buyState.tradePares, "reduce": false});
        this.registryStoreObject.set("lc_buy_cfg",{"obj": this.buyState.userCfg, "reduce": false});
        this.registryStoreObject.set("lc_buy_systemCfg",{"obj": this.buyState.systemCfg, "reduce": false});
        this.registryStoreObject.set("lc_rowConfig",{"obj": this.sellPanelState.rowConfig, "reduce": false});
        this.registryStoreObject.set("lc_buy_rowConfig",{"obj": this.buyPanelState.rowConfig, "reduce": false});
        this.registryStoreObject.set("lc_last100RSIValue",{"obj": this.indicatorReadState.last100RSIValue, "reduce": true});
        this.registryStoreObject.set("lc_last100PriceValue",{"obj": this.indicatorReadState.last100PriceValue, "reduce": true});
        this.registryStoreObject.set("lc_last1kRSIValue",{"obj": this.indicatorReadState.last1kRSIValue, "reduce": true});
    }

    reverse() {
        this.registryStoreObject.forEach((reg) => {
            if(reg.value.reduce){
                reg.value.obj = this.reduce(reg.value.obj, LocalStorageManager.getStorage(reg.key));
            } else {
                reg.value.obj = {...reg.value.obj, ...LocalStorageManager.getStorage(reg.key)};
            }
        })
    }
}

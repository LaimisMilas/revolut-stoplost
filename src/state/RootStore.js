import {StopLostState} from './StopLostState';
import {CfgPanelState} from './CfgPanelState';
import {LocalStorageManager} from "../storage/LocalStorageManager";
import {SessionStorageManager} from "../storage/SessionStorageManager";
import {BuyState} from "./BuyState";
import {CfgBuyPanelState} from "./CfgBuyPanelState";
export class RootStore {

    stopLostState = null;
    buyState = null;
    cfgPanelState = null;
    cfgBuyPanelState = null;
    prefix = "lc_";

    constructor() {
        this.stopLostState = new StopLostState();
        this.buyState = new BuyState();
        this.cfgPanelState = new CfgPanelState();
        this.cfgBuyPanelState = new CfgBuyPanelState();
        this.setupStoreRelationships(" RootStore.constructor()");
    }

    setupStoreRelationships(caller) {
        this.stopLostState.setup(this, this.cfgPanelState);
        this.buyState.setup(this, this.cfgBuyPanelState);
        this.cfgPanelState.setup(this, this.stopLostState);
        this.cfgBuyPanelState.setup(this, this.buyState);

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
        this.cfgPanelState.badge = {...SessionStorageManager.getStorage("lc_badgeLc"), ...this.cfgPanelState.badge};
        this.cfgBuyPanelState.badge = {...SessionStorageManager.getStorage("lc_buy_badgeLc"), ...this.cfgBuyPanelState.badge};
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
        this.cfgPanelState.badge = {...this.cfgPanelState.badge, ...SessionStorageManager.getStorage("lc_badgeLc")};
        this.cfgBuyPanelState.badge = {...this.cfgBuyPanelState.badge, ...SessionStorageManager.getStorage("lc_buy_badgeLc")};
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
        SessionStorageManager.flash("lc_badgeLc", this.cfgPanelState.badge);
        SessionStorageManager.flash("lc_buy_badgeLc", this.cfgBuyPanelState.badge);
        LocalStorageManager.flash("lc_store_state", 1);
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
        SessionStorageManager.flash("lc_badgeLc", this.cfgPanelState.badge);
        SessionStorageManager.flash("lc_buy_badgeLc", this.cfgBuyPanelState.badge);
        LocalStorageManager.flash("lc_store_state", 1);
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
    }
}

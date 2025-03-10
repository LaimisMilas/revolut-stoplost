import {CfgState} from './CfgState';
import {CfgPanelState} from './CfgPanelState';
import {RuleState} from './RuleState';
import {LocalStorageManager} from "../storage/LocalStorageManager";
import {ScrollState} from "./ScrollState";
import {NavigationState} from "./NavigationState";
import {SessionStorageManager} from "../storage/SessionStorageManager";
import {ActorState} from "./ActorState";
import {AuthState} from "./AuthState";
import {TimeOutState} from "./TimeOutState";
export class RootStore {

    actorState = null;
    cfgState = null;
    cfgPanelState = null;
    ruleState = null;
    scrollState = null;
    navigationState = null;
    prefix = "lc_";
    actorProfileData = null;
    authState = null;
    clickSubscribeState = null;
    timeOutState = null;

    constructor() {
        this.authState = new AuthState();
        this.actorState = new ActorState();
        this.ruleState = new RuleState();
        this.cfgState = new CfgState();
        this.cfgPanelState = new CfgPanelState();
        this.scrollState = new ScrollState();
        this.navigationState = new NavigationState();
        this.timeOutState = new TimeOutState();
        this.setupStoreRelationships(" RootStore.constructor()");
    }

    setupStoreRelationships(caller) {
        this.authState.setup(" RootStore.setupStoreRelationships() <-" + caller);
        this.cfgState.setup(this, this.authState, this.cfgPanelState);
        this.actorState.setup(this.cfgState, " RootStore.setupStoreRelationships() <-" + caller);
        this.ruleState.setup(this);
        this.scrollState.setup(this, " RootStore.setupStoreRelationships() <-" + caller);
        this.navigationState.setup(this, " RootStore.setupStoreRelationships() <-" + caller);
        this.cfgPanelState.setup(this, this.cfgState);
        this.timeOutState.setup();

        if(window.location.href.includes("http://localhost:8083")) {
            return;
        }

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
        this.cfgState.userCfg = {...LocalStorageManager.getStorage("lc_cfg"), ...this.cfgState.userCfg};
        this.cfgState.systemCfg = {...LocalStorageManager.getStorage("lc_systemCfg"), ...this.cfgState.systemCfg};
        this.cfgPanelState.rowConfig = {...LocalStorageManager.getStorage("lc_rowConfig"), ...this.cfgPanelState.rowConfig};
        this.scrollState.cfg = {...LocalStorageManager.getStorage("lc_scrollCfg"), ...this.scrollState.cfg};
        this.navigationState.nav = {...LocalStorageManager.getStorage("lc_navCfg"), ...this.navigationState.nav};
        this.cfgPanelState.badge = {...SessionStorageManager.getStorage("lc_badgeLc"), ...this.cfgPanelState.badge};
        this.ruleState.ruleSets = this.reduce(LocalStorageManager.getStorage("lc_ruleSets"), this.ruleState.ruleSets);
        this.ruleState.currentIntent = LocalStorageManager.getStorage("lc_currentIntent");
        this.authState.user = {...SessionStorageManager.getStorage("lc_user"), ...this.authState.user};
        this.actorState.interactedActors = {...LocalStorageManager.getStorageAsMap("lc_interactedActors"), ...this.actorState.interactedActors};
    }

    reduce(acc, bcc){
        return acc.concat(bcc);
    }

    reverseLoudLocalStorage() {
        /** gražinamas rezultatas yra JSON formatu, parsinamas iš string objekto */
        this.cfgState.userCfg = {...this.cfgState.userCfg, ...LocalStorageManager.getStorage("lc_cfg")};
        this.cfgState.systemCfg = {...this.cfgState.systemCfg, ...LocalStorageManager.getStorage("lc_systemCfg")};
        this.cfgPanelState.rowConfig = {...this.cfgPanelState.rowConfig, ...LocalStorageManager.getStorage("lc_rowConfig")};
        this.scrollState.cfg = {...this.scrollState.cfg, ...LocalStorageManager.getStorage("lc_scrollCfg")};
        this.navigationState.nav = {...this.navigationState.nav, ...LocalStorageManager.getStorage("lc_navCfg")};
        this.cfgPanelState.badge = {...this.cfgPanelState.badge, ...SessionStorageManager.getStorage("lc_badgeLc")};
        this.ruleState.ruleSets = this.reduce(this.ruleState.ruleSets, LocalStorageManager.getStorage("lc_ruleSets"));
        this.ruleState.currentIntent = LocalStorageManager.getStorage("lc_currentIntent");
        this.authState.user = LocalStorageManager.getStorage("lc_user");
        this.actorState.interactedActors = LocalStorageManager.getStorageAsMap("lc_interactedActors");
    }

    saveStorage() {
        LocalStorageManager.flash("lc_cfg", this.cfgState.userCfg);
        LocalStorageManager.flash("lc_systemCfg", this.cfgState.systemCfg);
        LocalStorageManager.flash("lc_rowConfig", this.cfgPanelState.rowConfig);
        LocalStorageManager.flash("lc_scrollCfg", this.scrollState.cfg);
        LocalStorageManager.flash("lc_navCfg", this.navigationState.nav);
        SessionStorageManager.flash("lc_badgeLc", this.cfgPanelState.badge);
        LocalStorageManager.flash("lc_ruleSets", this.ruleState.ruleSets);
        LocalStorageManager.flash("lc_store_state", 1);
        LocalStorageManager.flash("lc_currentIntent", this.ruleState.currentIntent);
        LocalStorageManager.flash("lc_user", this.authState.user);
        LocalStorageManager.flash("lc_interactedActors", this.actorState.interactedActors);
    }


    initializeLocalStorage() {
        LocalStorageManager.flash("lc_cfg", this.cfgState.userCfg);
        LocalStorageManager.flash("lc_systemCfg", this.cfgState.systemCfg);
        LocalStorageManager.flash("lc_rowConfig", this.cfgPanelState.rowConfig);
        LocalStorageManager.flash("lc_scrollCfg", this.scrollState.cfg);
        LocalStorageManager.flash("lc_navCfg", this.navigationState.nav);
        SessionStorageManager.flash("lc_badgeLc", this.cfgPanelState.badge);
        LocalStorageManager.flash("lc_ruleSets", this.ruleState.ruleSets);
        LocalStorageManager.flash("lc_store_state", 1);
        LocalStorageManager.flash("lc_currentIntent", this.ruleState.currentIntent);
        LocalStorageManager.flash("lc_user", this.authState.user);
        LocalStorageManager.flash("lc_interactedActors", this.actorState.interactedActors);
    }

    deleteAllData() {
        LocalStorageManager.removeStorageItem("lc_store_state");
        LocalStorageManager.removeStorageItem("lc_ignored_actor");
        LocalStorageManager.removeStorageItem("lc_friend_actor");
        LocalStorageManager.removeStorageItem("lc_cfg");
        LocalStorageManager.removeStorageItem("lc_systemCfg");
        LocalStorageManager.removeStorageItem("lc_rowConfig");
        LocalStorageManager.removeStorageItem("lc_scrollCfg");
        LocalStorageManager.removeStorageItem("lc_navCfg");
        SessionStorageManager.removeStorageItem("lc_badgeLc");
        LocalStorageManager.removeStorageItem("lc_ruleSets");
        LocalStorageManager.removeStorageItem("lc_store_state");
        LocalStorageManager.removeStorageItem("lc_currentIntent");
        LocalStorageManager.removeStorageItem("lc_user");
        LocalStorageManager.removeStorageItem("lc_interactedActors");
    }
}

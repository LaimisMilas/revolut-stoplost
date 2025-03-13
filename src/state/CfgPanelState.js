import {DateFormat} from "html-evaluate-utils/DateFormat";
import { makeAutoObservable} from "mobx";
import {readLastPrice} from "../utils/RevolutUtils";

export class CfgPanelState {

    rootStore = null;

    cfgState = null;

    rowConfig = {};

    badge = {};

    active = {}

    stopAllAction = false;

    intervalUpdateTimeDiff = null;

    constructor() {
        makeAutoObservable(this);
    }
    
    setStopAllAction(stopAllAction) {
        this.stopAllAction = stopAllAction;
    }

    setup(rootStore, cfgState, caller) {
        this.rootStore = rootStore;
        this.cfgState = cfgState;
        this. initializeRowConfig();
        this.setIntervalUpdateTimeDiff();
    }

    initializeRowConfig() {
        this.rowConfig = {
            price: {
                label: "Price" ,
                id: "price_id",
                name: "price_name",
                key: "price"
            },
            exchPare: {
                label: "Exch. pare" ,
                id: "exchPare_id",
                name: "exchPare_name",
                key: "name"
            },
            stopLost: {
                label: "Stop-lost %",
                id: "stopLost_id",
                name: "stopLost_name",
                key: "stopLost"
            },
            quantity: {
                label: "Sell qntty.?",
                id: "quantity_id",
                name: "quantity_name",
                key: "quantity"
            },
            takeProf: {
                label: "Take-prof %" ,
                id: "takeProf_id",
                name: "takeProf_name",
                key: "takeProf"
            },
            takeProfRsi: {
                label: "RSI 14",
                id: "takeProfRsi_id",
                name: "takeProfRsi_name",
                key: "takeProfRsi"
            },
            scroll: {
                label: "Scroller" ,
                id: "scroll_id",
                name: "scroll_name",
                key: "scroll"
            }
        };
        this.badge = {
            price: 0,
            stopLost: 0,
            quantity: 0,
            takeProf: 0,
            rsi14: 0,
            exchPare: 0,
        };
        this.active = {
            fromDate: DateFormat.formatDate(new Date()),
            from: Date.now(),
            timeDiff: 0
        }
        this.stopAllAction = false;
    }

    updateBadge(fieldName, value) {
        this.badge[fieldName] = value;
    }

    setIntervalUpdateTimeDiff(){
        this.intervalUpdateTimeDiff = setInterval(
            this.updateTimeDiff.bind(this), 30000);
    }

    updateTimeDiff() {
        this.active.timeDiff = DateFormat.calculateTimeDifferenceInMinutes(Date.now(), this.active.from);
    }

    updateRowConfigCheckValue(fieldName, newValue) {
        this.rowConfig[fieldName].checkValue = newValue;
    }
    
    handleStopButtonClick(stop) {
        this.rootStore.cfgState.systemCfg.cfg.linkedInLike.root.run = stop === true;
        this.rootStore.scrollState.cfg.root.run = stop === true;
        this.rootStore.navigationState.nav.root.run = stop === true;
    }

    getIsActionsStop() {
        return this.cfgState.systemCfg.cfg.linkedInLike.root.run === false;
    }

    updateStopLostPrice() {
        let lastPrice = readLastPrice();
        this.stopLostPrice = lastPrice;
    }

    setIntervalUpdate(){
        this.intervalUpdateTimeDiff = setInterval(
            this.updateStopLostPrice.bind(this), 4000);
    }
}

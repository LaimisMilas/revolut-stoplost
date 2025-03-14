import {DateFormat} from "html-evaluate-utils/DateFormat";
import { makeAutoObservable} from "mobx";

export class CfgPanelState {

    rootStore = null;

    cfgState = null;

    rowConfig = {};

    active = {}

    stopAllAction = false;

    intervalUpdateTimeDiff = null;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, cfgState) {
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
            }
        };

        this.active = {
            fromDate: DateFormat.formatDate(new Date()),
            from: Date.now(),
            timeDiff: 0
        }
        this.stopAllAction = false;
    }

    setIntervalUpdateTimeDiff(){
        this.intervalUpdateTimeDiff = setInterval(
            this.updateTimeDiff.bind(this), 30000);
    }

    updateTimeDiff() {
        this.active.timeDiff = DateFormat.calculateTimeDifferenceInMinutes(Date.now(), this.active.from);
    }

    getIsActionsStop() {
        return this.cfgState.systemCfg.cfg.linkedInLike.root.run === false;
    }
}

import {DateFormat} from "html-evaluate-utils/DateFormat";
import { makeAutoObservable} from "mobx";

export class BuyPanelState {

    rootStore = null;

    cfgState = null;

    rowConfig = {};

    active = {}

    stopAllAction = false;

    intervalUpdateTimeDiff = null;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, cfgState, caller) {
        this.rootStore = rootStore;
        this.cfgState = cfgState;
        this. initializeRowConfig();
        this.setIntervalUpdateTimeDiff();
    }

    initializeRowConfig() {
        this.rowConfig = {
            targetPrice: {
                label: "Target price:" ,
                id: "targetPrice_id",
                name: "targetPrice_name",
                key: "targetPrice"
            },
            exchPare: {
                label: "Exch. pare" ,
                id: "exchPare_id",
                name: "exchPare_name",
                key: "name"
            },
            rsi: {
                label: "RSI 14",
                id: "rsi_id",
                name: "rsi_name",
                key: "rsi"
            },
            quantity: {
                label: "Buy qntty.?",
                id: "quantity_id",
                name: "quantity_name",
                key: "quantity"
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

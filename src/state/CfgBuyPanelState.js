import {DateFormat} from "html-evaluate-utils/DateFormat";
import { makeAutoObservable} from "mobx";

export class CfgBuyPanelState {

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
            newPoster: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.newPoster.run,
                label: "New poster",
                id: "newPoster_id",
                name: "newPoster_name",
                key: "newPoster"
            },
            like: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.like.run,
                label: "Target price:" ,
                id: "like_id",
                name: "like_name",
                key: "like"
            },
            repost: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.repost.run,
                label: "Exch. pare" ,
                id: "repost_id",
                name: "repost_name",
                key: "repost"
            },
            follower: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.follower.run,
                label: "RSI 14",
                id: "follower_id",
                name: "follower_name",
                key: "follower"
            },
            subscriber: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.subscriber.run,
                label: "Buy qntty.?",
                id: "subscriber_id",
                name: "subscriber_name",
                key: "subscriber"
            },
            accepter: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.accepter.run,
                label: "Take-prof %" ,
                id: "saccepter_id",
                name: "accepter_name",
                key: "accepter"
            },
            connector: {
                checkValue: this.cfgState.systemCfg.cfg.linkedInLike.connector.run,
                label: "Connector",
                id: "connector_id",
                name: "connector_name",
                key: "connector"
            },
            scroll: {
                checkValue : true,
                label: "Scroller" ,
                id: "scroll_id",
                name: "scroll_name",
                key: "scroll"
            }
        };
        this.badge = {
            newPoster: 0,
            like: 0,
            follower: 0,
            subscriber: 0,
            accepter: 0,
            connector: 0,
            repost: 0,
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
}

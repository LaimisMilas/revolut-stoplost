import { makeAutoObservable} from "mobx";
import {TrailingBuyBot} from "../indicator/TrailingBuyBot";
import {TrailingSellBot} from "../indicator/TrailingSellBot";
export class TrailingService {

    rootStore = null;

    lastRSIValue = 0;
    trailingActivatePoint = 40;
    isTrailingActive = false;
    trailingPoint = 0;
    deltaRate = 5;
    buyPointReached = false;
    deltaValue = 0;

    trailingBuyBot = null;
    trailingSellBot = null;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
        this.trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 5 });
        this.trailingSellBot = new TrailingSellBot({ trailingActivateRSI: 0, trailingPercent: 5 });
    }

    updateTrailingBuyBot(){
        this.trailingBuyBot.updateRSI(Number(this.lastRSIValue));
    }

    updateTrailingSellBot(){
        this.trailingSellBot.updateRSI(Number(this.lastRSIValue));
    }

}
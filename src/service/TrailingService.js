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
        this.trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: 40, trailingPercent: 5 });
        this.trailingSellBot = new TrailingSellBot({ trailingActivateRSI: 60, trailingPercent: 5 });
    }

    doTrailingAction(){
        if(Number(this.lastRSIValue) < Number(this.trailingActivatePoint)){
            if(!this.isTrailingActive){
                this.trailingPoint = this.trailingActivatePoint;
                this.deltaValue = (Number(this.trailingActivatePoint) * Number(this.deltaRate))/100;
                this.buyPointReached = false;
                this.isTrailingActive = true;
            }
            if(Number(this.lastRSIValue) < Number(this.trailingPoint)){
                if(Number(this.lastRSIValue) < Number(this.trailingPoint - this.deltaValue)){
                    this.trailingPoint = Number(this.lastRSIValue);
                }
            } else {
                if(Number(this.lastRSIValue) > Number(this.trailingPoint)){
                    this.buyPointReached = true;
                }
            }
        } else {
            if(this.isTrailingActive){
                this.isTrailingActive = false;
                this.trailingPoint = 0;
                this.deltaValue = 0;
            }
        }
    }

    updateTrailingBuyBot(){
        this.trailingBuyBot.updateRSI(Number(this.lastRSIValue));
    }

    updateTrailingSellBot(){
        this.trailingSellBot.updateRSI(Number(this.lastRSIValue));
    }

}
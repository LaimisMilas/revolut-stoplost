import { makeAutoObservable} from "mobx";
import {getRSIIndicator, readLastPrice} from "../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";

export class IndicatorReadState {

    rootStore = null;
    intervalRsiRaed = null;
    lastRSIValue = 0;
    last100RSIValue = [];
    lastPriceValue = 0;
    last100PriceValue = [];

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
        this.setIntervalRsiRaed();
    }

    setIntervalRsiRaed(){
        this.intervalRsiRaed = setInterval(
            this.updateValues.bind(this), 3000);
    }

    async updateValues() {
        await this.updateLastPrice();
        await this.updateLastRSI();
    }

    async updateLastRSI() {
        if(Utils.getElByXPath("//iframe")){
            let value = await getRSIIndicator();
            if(value && value > 0){
                this.lastRSIValue = value;
                this.last100RSIValue = this.pushWithLimit(this.last100RSIValue, value, 225);
            }
        }
    }

    async updateLastPrice() {
        let value = await readLastPrice();
        if(value && value > 0){
            this.lastPriceValue = value;
            this.last100PriceValue = this.pushWithLimit(this.last100PriceValue, value, 225);
        }
    }

    pushWithLimit(arr, value, maxLength) {
        arr.push(value); // Pridedame į galą
        if (arr.length > maxLength) {
            arr.shift(); // Pašaliname pirmą (seniausią) elementą
        }
        return arr;
    }
}

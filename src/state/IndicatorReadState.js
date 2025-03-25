import { makeAutoObservable} from "mobx";
import {getRSIIndicator, readLastPrice} from "../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";
import {downsampleArray} from "../utils/dataFilter";

export class IndicatorReadState {

    rootStore = null;
    intervalRsiRaed = null;
    lastRSIValue = 0;
    last100RSIValue = [];
    lastPriceValue = 0;
    last100PriceValue = [];
    last1kRSIValue = [];
    last100RSICounter = 0;
    period = 5;
    readDataPeriod = 3000;
    maxLengthRSIValue = 200;
    maxLengthPriceValue = 1000;
    tickerValue = [];

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
        this.setIntervalRsiRaed();
    }

    setIntervalRsiRaed(){
        this.intervalRsiRaed = setInterval(
            this.updateValues.bind(this), this.readDataPeriod);
    }

    async updateValues() {
        await this.updateLastPrice();
        await this.updateLastRSI();
        await this.updateLastRSI1K();
    }

    async updateLastRSI() {
        if(Utils.getElByXPath("//iframe")){
            let value = await getRSIIndicator();
            if(value && value > 0){
                this.lastRSIValue = value;
                this.last100RSIValue = this.pushWithLimit(this.last100RSIValue, value, this.maxLengthRSIValue);
                this.last100RSICounter ++;
            }
        }
    }

    async updateLastRSI1K() {
        if(Utils.getElByXPath("//iframe")){
            let value = await getRSIIndicator();
            if(value && value > 0){
                this.last1kRSIValue = this.pushWithLimit(this.last1kRSIValue, value, 1000);
            }
        }
    }

    async updateLastPrice() {
        let value = await readLastPrice();
        if(value && value > 0){
            this.lastPriceValue = value;
            this.last100PriceValue = this.pushWithLimit(this.last100PriceValue, value, this.maxLengthPriceValue);
        }
    }

    pushWithLimit(arr, value, maxLength) {
        arr.push(value); // Pridedame į galą
        if (arr.length > maxLength) {
            arr.shift(); // Pašaliname pirmą (seniausią) elementą
        }
        if (arr.length > maxLength) {
            arr = arr.slice(arr.length - maxLength, arr.length);
        }
        return arr;
    }

    //327 = 15min. 109 = 5min. norint matyti MACD reikia bent 26 po 109
    // tai chunkSize = 109, 26 x 109 = 2834(mini data set)
    getLastTickers(size = 300, chunkSize = 10){
        let data = this.tickerValue.map(item => parseFloat(item.indexPrice));
        const from = data.length - size;
        const to = data.length - 1;
        data = downsampleArray(data.slice(from, to), chunkSize);
        return data;
    }



}

import { makeAutoObservable} from "mobx";
import {getRSIIndicator, readLastPrice} from "../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";
import {downsampleArray} from "../utils/dataFilter";
import {calculateRSI} from "../indicator/RSI14";
import {checkDivergence} from "../utils/IndicatorsUtils";
import {doParabolicCorrelation, doSinusoidCorrelation} from "../indicator/Correletion";

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
    rsiTickerValue = [];
    divergence = "";
    sinusoidCorrelation = 0;
    parabolicCorrelation = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
    }

    updateLast100Price(){
        this.last100PriceValue = this.tickerValue.map(item => parseFloat(item.indexPrice));
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
    getLastTickers(size = 300, chunkSize = 1){
        let data = this.tickerValue.map(item => parseFloat(item.indexPrice));
        const from = data.length - size;
        const to = data.length - 1;
        data = downsampleArray(data.slice(from, to), chunkSize);
        this.lastPriceValue = data[data.length -1];
        return data;
    }

    calculateRSITicker = (size, chunkSize) => {
        let data = this.getLastTickers(size + 14, chunkSize);
        this.last100RSIValue = calculateRSI(data);
        if(this.last100RSIValue.length > 0){
            this.lastRSIValue = Number(this.last100RSIValue[this.last100RSIValue.length -1]).toFixed(2);
        }
    }

    calculateDivergence() {
       this.divergence = checkDivergence(this.last100PriceValue,this.last100RSIValue);
    }

    calcSinusoidCorrelation() {
       this.sinusoidCorrelation = doSinusoidCorrelation(this.last100RSIValue);
    }

    calcParabolicCorrelation() {
        this.parabolicCorrelation = doParabolicCorrelation(this.last100RSIValue);
    }


}

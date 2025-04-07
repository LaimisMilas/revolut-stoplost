import { makeAutoObservable} from "mobx";
import {downsampleArray} from "../utils/dataFilter";

export class TickerService {

    rootStore = null;
    tickers = [];
    maxTickerLength = 11250;
    prices = [];
    priceChunkSize = 218;
    lastPriceValue = 0;
    historyData = [];
    maxHistoryLength = 11250;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, indicatorReadState) {
        this.rootStore = rootStore;
        this.indicatorReadState = indicatorReadState;
    }

    pushNewHistory(pushNewValue) {
        this.historyData.push(pushNewValue);
        if (this.historyData.length > this.maxHistoryLength) {
            this.historyData.shift();
        }
        if (this.historyData.length > this.maxHistoryLength) {
            this.historyData = this.historyData.slice(this.historyData.length - this.maxHistoryLength, this.historyData.length);
        }
    }

    pushNewTicker(pushNewValue) {
        this.tickers.push(pushNewValue); // Pridedame į galą
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers.shift(); // Pašaliname pirmą (seniausią) elementą
        }
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers = this.tickers.slice(this.tickers.length - this.maxTickerLength, this.tickers.length);
            this.parsePrices(600 + 14, 30);
            this.indicatorReadState.updateIndicator(this.prices);
        }
    }

    //327 = 15min. 109 = 5min. norint matyti MACD reikia bent 26 po 109
    // tai chunkSize = 109, 26 x 109 = 2834(mini data set)
    // length - masyvi dydis nuo galo, naudingas kada norima skaicioti ne is visu tickers reiksmiu
    parsePrices(length = 300, chunkSize = 1){
        let data = this.tickers.map(item => parseFloat(item.indexPrice));
        const from = data.length - length;
        const to = data.length - 1;
        data = downsampleArray(data.slice(from, to), chunkSize);
        this.prices = data;
        this.lastPriceValue = data[data.length -1];
    }

}
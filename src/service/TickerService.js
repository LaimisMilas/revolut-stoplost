import { makeAutoObservable} from "mobx";

export class TickerService {

    rootStore = null;
    tickers = [];
    maxTickerLength = 11250;
    prices = [];
    lastPriceValue = 0;
    historyData = [];
    maxHistoryLength = 11250;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
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
        this.tickers.push(pushNewValue);
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers.shift();
        }
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers = this.tickers.slice(-this.maxTickerLength);
        }
        this.parsePrices();
    }

    parsePrices(){
        let data = this.tickers.map(item => parseFloat(item.indexPrice));
        this.prices = data;
        this.lastPriceValue = data[data.length -1];
    }

}
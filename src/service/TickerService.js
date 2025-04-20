import { makeAutoObservable} from "mobx";

export class TickerService {

    rootStore = null;
    tickers = [];
    maxTickerLength = 11250;
    tickerIndex = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
    }

    pushNewTicker(pushNewValue) {
        this.tickers.push(pushNewValue);
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers.shift();
        }
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers = this.tickers.slice(-this.maxTickerLength);
        }
    }

    getTickers() {
        return this.tickers;
    }

}
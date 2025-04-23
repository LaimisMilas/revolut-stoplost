import { makeAutoObservable} from "mobx";

export class TickerService {

    rootStore = null;
    tickers = [];
    maxTickerLength = 11250;
    tickerCounter = 0;

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

    getLastTickers() {
        return this.tickers[this.tickers.length - 1];
    }

    async storeTicker(ticker){
        if(ticker){
            fetch("http://localhost:3000/api/tickers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticker),
            }).then(response => response.json())
                .then(data => {
                    console.log('Atsakymas:', data);
                })
                .catch((error) => {
                    console.error('Klaida:', error);
                });
        }
    }

}
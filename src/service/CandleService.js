import { makeAutoObservable} from "mobx";

export class CandleService {

    rootStore = null;
    historyCandle = [];
    maxHistoryLength = 11250;
    candle = {
        "timestamp": 1713356400000,
        "open": 0.0,
        "high": 0.0,
        "low": 0.0,
        "close": 0.0
    }
    currentCandle;
    candleCounter = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
    }

    getHistoryCandle() {
        return this.historyCandle;
    }

    getCurrentCandle() {
            return this.currentCandle;
    }
    pushNewHistoryCandle(pushNewValue) {
        this.historyCandle.push(pushNewValue);
        if (this.historyCandle.length > this.maxHistoryLength) {
            this.historyCandle.shift();
        }
        if (this.historyCandle.length > this.maxHistoryLength) {
            this.historyCandle = this.historyCandle.slice(-this.maxHistoryLength);
        }
    }

    setHistoryCandles(candles) {
        this.historyCandle = candles;
    }

    updateCurrentCandle(){
        if(this.historyCandle.length > 0){
            this.currentCandle = this.historyCandle[this.historyCandle.length - 1];
        }
    }

    async storeCurrentCandle(){
       if(this.currentCandle){
           fetch("http://localhost:3000/api/candles", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               body: JSON.stringify(this.currentCandle),
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
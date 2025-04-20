import { makeAutoObservable} from "mobx";

export class CandleService {

    rootStore = null;
    historyCandle = [];
    maxHistoryLength = 11250;
    candle = {
        "timestamp": 1713356400000,
        "open": 50321.23,
        "high": 50321.23,
        "low": 50321.23,
        "close": 50321.23
    }
    currentCandle;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
    }

    getHistoryCandle() {
        return this.historyCandle;
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
           fetch("http://localhost:3000/api/candle", {
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
import { makeAutoObservable} from "mobx";

export class CandleService {

    rootStore = null;
    historyCandle = [];
    maxHistoryLength = 11250;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
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

    async sendLastCandles(){
       if(this.historyCandle.length > 0){
           const sendCandle = this.historyCandle[this.historyCandle.length - 1];
           fetch("http://localhost:3000/api/candle", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
               },
               body: JSON.stringify(sendCandle),
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
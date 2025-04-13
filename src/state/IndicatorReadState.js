import { makeAutoObservable} from "mobx";
import {downsampleArray} from "../utils/dataFilter";
import {calculateRSI} from "../indicator/RSI14";
import {checkDivergence} from "../utils/IndicatorsUtils";
import {
    doBearishLineCorrelation,
    doBullishLineCorrelation,
    doLeftLineCorrelation,
    doParabolicCorrelation,
    doSinusoidCorrelation
} from "../indicator/Correletion";
import {TrailingBuyBot} from "../indicator/TrailingBuyBot";
import {getTrendByEMA} from "../indicator/MACD";
import {calculateAroon} from "../indicator/Aroon";
import {TrailingSellBot} from "../indicator/TrailingSellBot";

export class IndicatorReadState {

    rootStore = null;
    intervalRsiRaed = null;
    lastRSIValue = 0.00;
    last100RSIValue = [];
    lastPriceValue = 0.00;
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
    pricePrediction = 0;
    leftLineCorrelation = 0;
    bullishLineCorrelation = 0
    bearishLineCorrelation = 0;
    tickerIndex = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
    }

    updateLast100Price(){
        if(this.tickerValue){
            this.last100PriceValue = this.tickerValue.map(item => parseFloat(item.indexPrice));
            this.calculateTrendByEMA();
            this.calculateDynamicTrend();
            this.calcBullishLineCorrelation();
            this.calcSinusoidCorrelation();
            this.calculateDivergence();
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
    getLastTickers(size = 300, chunkSize = 1){
        if(this.tickerValue.length > 0){
            let data = this.tickerValue.map(item => parseFloat(item.indexPrice));
            const from = data.length - size;
            const to = data.length - 1;
            data = downsampleArray(data.slice(from, to), chunkSize);
            this.lastPriceValue = data[data.length -1];
            return data;
        }
        return null;
    }

    calculateRSITicker = (size, chunkSize) => {
        let prices = this.getLastTickers(size + 14, chunkSize);
        if(prices.length >= 14){
            this.updateRSI(prices);
        }
    }

    updateIndicator(prices){
        this.updateRSI(prices);
        this.calculateDivergence();
        this.calcSinusoidCorrelation();
        this.calcParabolicCorrelation();
        this.calcLeftLineCorrelation();
        this.calcBullishLineCorrelation();
        this.calcBearishLineCorrelation();
        this.updateTrailingBuyBot();
        this.calculateTrendByEMA();
        this.calculateAroon();
    }

    updateRSI(prices){
        if(prices.length >= 14){
            this.last100RSIValue = calculateRSI(prices);
            if(this.last100RSIValue.length > 0){
                this.lastRSIValue = Number(this.last100RSIValue[this.last100RSIValue.length -1]).toFixed(2);
                this.calculateAroon();
                this.updateTrailingBuyBot();
            }
        }
    }

    calculateDivergence() {
       this.divergence = checkDivergence(this.last100PriceValue,this.last100RSIValue);
    }

    calcSinusoidCorrelation() {
      // const rsi = downsampleArray(900, 7);
       this.sinusoidCorrelation = doSinusoidCorrelation(this.last100RSIValue);
    }

    calcParabolicCorrelation() {
        this.parabolicCorrelation = doParabolicCorrelation(this.last100RSIValue);
    }

    calcLeftLineCorrelation() {
        this.leftLineCorrelation = doLeftLineCorrelation(this.last100RSIValue);
    }

    calcBullishLineCorrelation() {
        this.bullishLineCorrelation = doBullishLineCorrelation(this.last100RSIValue);
    }

    calcBearishLineCorrelation() {
        this.bearishLineCorrelation = doBearishLineCorrelation(this.last100RSIValue);
    }

    trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 });
    trailingSellBot = new TrailingSellBot({ trailingActivateRSI: 10, trailingPercent: 10 });

    updateTrailingBuyBot(){
        if(this.lastRSIValue){
            this.trailingBuyBot.updateRSI(Number(this.lastRSIValue));
            this.trailingSellBot.updateRSI(Number(this.lastRSIValue));
        }
    }

    trendByPrice = "";
    trendByPrice1min = "";

    calculateTrendByEMA() {
        const dataLength = 900; // 900 / 60 = 15min.
        const chunkSizeShort = 1;// 1*5 = 5s
        const chunkSizeLong = 5; // 1*10 = 10s
        if(dataLength / chunkSizeLong > 26 && this.last100PriceValue.length > dataLength){ // 900/26 = 34 galima didinti chunkSize iki 34

            let prices = this.last100PriceValue;
            prices = prices.slice(prices.length - dataLength, prices.length);
            prices = downsampleArray(prices, chunkSizeShort);
            //kad suskaicioti EMA reikia min 26 kainu tai dataLength/chunkSize turi gautis daugiau uz 26
            this.trendByPrice = getTrendByEMA(prices);

            prices = this.last100PriceValue;
            prices = prices.slice(prices.length - dataLength, prices.length);
            prices = downsampleArray(prices, chunkSizeLong);
            this.trendByPrice1min = getTrendByEMA(prices);
        }
    }

    dynamicTrendDataLength = 900;
    dynamicTrendChunkSize = 5;
    dynamicTrendChunkSizeDefault = 5;

    calculateDynamicTrend() {
        if(this.dynamicTrendDataLength / this.dynamicTrendChunkSize > 26
            && this.last100PriceValue.length > this.dynamicTrendDataLength){
            let prices = this.last100PriceValue;
            prices = prices.slice(prices.length - this.dynamicTrendDataLength, prices.length);
            prices = downsampleArray(prices, this.dynamicTrendChunkSize);
            this.trendDynamic = getTrendByEMA(prices);
        }
    }

    calculateTrend(size, chunkSize) {
        if(size / chunkSize > 26
            && this.last100PriceValue.length > size){
            let prices = this.last100PriceValue;
            prices = prices.slice(prices.length - size, prices.length);
            prices = downsampleArray(prices, chunkSize);
            return getTrendByEMA(prices);
        }
        return 0;
    }

    stopLostDataChunk = [];

    storeTicker(dataChunk){
        const chunk = this.last100PriceValue.slice(
            this.last100PriceValue.length - dataChunk, this.last100PriceValue.length);
        this.stopLostDataChunk.push({
            data: chunk,
            lastPrice: this.lastPriceValue,
            date: new Date(),
        }) ;
    }

    getStopLostTicker(){
        let data = [];
        if(this.stopLostDataChunk.length > 0){
            data = this.stopLostDataChunk.map(item => data.push(...item.data));
        }
       return data;
    }

    aroonTrend = "";

    calculateAroon(){
        const dataLength = 900;
        if(this.last100PriceValue.length > dataLength){
            let prices = this.last100PriceValue;
            prices = prices.slice(prices.length - dataLength, prices.length);
            const result = calculateAroon(prices, 15);
            const aroonUp = result[0];
            const aroonDown = result[1];
            const diff = (aroonUp[aroonUp.length - 1] - aroonDown[aroonDown.length - 1]).toFixed(2);
            this.aroonTrend = aroonUp[aroonUp.length - 1] > aroonDown[aroonDown.length - 1] ? "up:" + diff : "down:" + diff;
        }
    }

    getPrediction = async () => {

        // Konvertuojame į JSON string
        const jsonData = JSON.stringify(this.last100PriceValue.slice(this.last100PriceValue.length - 601, this.last100PriceValue.length -1));

        // Siunčiame POST užklausą su fetch
        fetch('http://localhost:8080/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,  // Pridedame JSON duomenis į užklausą
        })
            .then(response => response.json())  // Apdorojame atsakymą kaip JSON
            .then(data => {
                this.pricePrediction = data.prediction;
                console.log('Atsakymas:', data.prediction);  // Išspausdiname atsakymą į konsolę
            })
            .catch((error) => {
                console.error('Klaida:', error);
            });
    }

}

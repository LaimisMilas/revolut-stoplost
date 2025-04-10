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
        let data = this.getLastTickers(size + 14, chunkSize);
        if(data.length >= 14){
            this.last100RSIValue = calculateRSI(data);
            if(this.last100RSIValue.length > 0){
                this.lastRSIValue = Number(this.last100RSIValue[this.last100RSIValue.length -1]).toFixed(2);
                this.calculateAroon();
                this.updateTrailingBuyBot();
                this.doTrailingAction();
            }
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
        this.doTrailingAction();
        this.calculateTrendByEMA();
        this.calculateAroon();
    }

    updateRSI(prices){
        if(prices.length >= 14){
            this.last100RSIValue = calculateRSI(prices);
            if(this.last100RSIValue.length > 0){
                this.lastRSIValue = Number(this.last100RSIValue[this.last100RSIValue.length -1]).toFixed(2);
            }
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

    calcLeftLineCorrelation() {
        this.leftLineCorrelation = doLeftLineCorrelation(this.last100RSIValue);
    }

    calcBullishLineCorrelation() {
        this.bullishLineCorrelation = doBullishLineCorrelation(this.last100RSIValue);
    }

    calcBearishLineCorrelation() {
        this.bearishLineCorrelation = doBearishLineCorrelation(this.last100RSIValue);
    }

    trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: 90, trailingPercent: 10 });

    updateTrailingBuyBot(){
        if(this.lastRSIValue){
            this.trailingBuyBot.updateRSI(Number(this.lastRSIValue));
        }
    }

    trailingActivatePoint = 40;
    isTrailingActive = false;
    trailingPoint = 0.00;
    deltaRate = 10;
    buyPointReached = false;
    deltaValue = 0;

    doTrailingAction(){
        if(Number(this.lastRSIValue) < Number(this.trailingActivatePoint)){
            if(!this.isTrailingActive){
                this.trailingPoint = this.trailingActivatePoint;
                this.deltaValue = (Number(this.trailingActivatePoint) * Number(this.deltaRate))/100;
                this.buyPointReached = false;
                this.isTrailingActive = true;
            }
            if(Number(this.lastRSIValue) < Number(this.trailingPoint)){
                if(Number(this.lastRSIValue) < Number(this.trailingPoint - this.deltaValue)){
                    this.trailingPoint = Number(this.lastRSIValue);
                }
            } else {
                if(Number(this.lastRSIValue) > Number(this.trailingPoint)){
                    this.buyPointReached = true;
                }
            }
        } else {
            if(this.isTrailingActive){
                this.isTrailingActive = false;
                this.trailingPoint = 0;
                this.deltaValue = 0;
            }
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

    calculateDynamicTrend() {
        if(this.dynamicTrendDataLength / this.dynamicTrendChunkSize > 26
            && this.last100PriceValue.length > this.dynamicTrendDataLength){
            let prices = this.last100PriceValue;
            prices = prices.slice(prices.length - this.dynamicTrendDataLength, prices.length);
            prices = downsampleArray(prices, this.dynamicTrendDataLength);
            this.trendDynamic = getTrendByEMA(prices);
        }
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

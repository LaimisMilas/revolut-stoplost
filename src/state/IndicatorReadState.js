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
import {analyzeCandles} from "../indicator/analyzeCandles";

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

    getLastTickers(size = 300, chunkSize = 1){
        if(this.tickerValue.length > 0){
            let data = this.getPriceByInterval(size, chunkSize);
            this.lastPriceValue = data[data.length -1];
            return data;
        }
        return null;
    }

    getPriceByInterval(size = 300, chunkSize = 1){
        if(this.tickerValue.length > 0){
            let data = this.tickerValue.map(item => parseFloat(item.indexPrice));
            const from = data.length - size;
            const to = data.length - 1;
            return downsampleArray(data.slice(from, to), chunkSize);
        }
        return null;
    }

    calculateRSITicker = (size, chunkSize) => {
        let prices = this.getLastTickers(size + 14, chunkSize);
        if(prices.length >= 14){
            this.updateRSI(prices);
        }
    }

    updateRSI(prices){
        if(prices.length >= 14){
            this.last100RSIValue = calculateRSI(prices);
            if(this.last100RSIValue.length > 0){
                this.lastRSIValue = Number(this.last100RSIValue[this.last100RSIValue.length -1]).toFixed(2);
                this.updateTrailingBuyBot();
                this.calculateDynamicTrend();
                this.calcRSITableValues();
                this.calcParabolicCorrelation();
                this.updateMinCandles();
            }
        }
    }

    calculateDivergence() {
       this.divergence = checkDivergence(this.last100PriceValue,this.last100RSIValue);
    }

    calcSinusoidCorrelation() {
       this.sinusoidCorrelation = doSinusoidCorrelation(this.last100RSIValue);
    }

    getSinusoidCorrelationData(size = 300, chunkSize = 1) {
        const data = this.getPriceByInterval(size, chunkSize);
        if(data){
            return doSinusoidCorrelation(data);
        }
        return null;
    }

    calcParabolicCorrelation() {
        this.parabolicCorrelation = doParabolicCorrelation(this.last100RSIValue);
    }

    getRSIParabolicCorrelation(size = 300, chunkSize = 1) {
        const data = this.getPriceByInterval(size, chunkSize);
        if(data){
            const rsi = calculateRSI(data);
            return doParabolicCorrelation(rsi);
        }
        return null;
    }

    getRSI14(size = 300, chunkSize = 1) {
        const data = this.getPriceByInterval(size, chunkSize);
        if(data){
            const rsi = calculateRSI(data);
            return  Number(rsi[rsi.length -1]).toFixed(2);
        }
        return null;
    }

    getParabolicCorrelation(size = 300, chunkSize = 1) {
        const data = this.getPriceByInterval(size, chunkSize);
        if(data){
            return doParabolicCorrelation(data);
        }
        return null;
    }

    calcLeftLineCorrelation() {
        this.leftLineCorrelation = doLeftLineCorrelation(this.last100RSIValue);
    }

    getLineCorrelation(size = 300, chunkSize = 1) {
        const data = this.getPriceByInterval(size, chunkSize);
        if(data){
            return doLeftLineCorrelation(data);
        }
        return null;
    }

    calcBullishLineCorrelation() {
        this.bullishLineCorrelation = doBullishLineCorrelation(this.last100RSIValue);
    }

    calcBearishLineCorrelation() {
        this.bearishLineCorrelation = doBearishLineCorrelation(this.last100RSIValue);
    }

    getBearishLineCorrelation(size = 300, chunkSize = 1) {
        const data = this.getPriceByInterval(size, chunkSize);
        if(data){
            return doBearishLineCorrelation(data);
        }
        return null;
    }

    trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 });
    trailingSellBot = new TrailingSellBot({ trailingActivateRSI: 10, trailingPercent: 10 });

    updateTrailingBuyBot(){
        if(this.rsiTable){
            this.trailingBuyBot.updateRSI(Number(this.rsiTable[0]));
            this.trailingBuyBots[0].updateRSI(Number(this.rsiTable[0]));
            this.trailingBuyBots[1].updateRSI(Number(this.rsiTable[1]));
            this.trailingBuyBots[2].updateRSI(Number(this.rsiTable[2]));
            this.trailingBuyBots[3].updateRSI(Number(this.rsiTable[3]));
            this.trailingBuyBots[4].updateRSI(Number(this.rsiTable[4]));
            this.trailingBuyBots[5].updateRSI(Number(this.rsiTable[5]));
        }
    }

    trailingBuyBots = [
        new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
        new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
        new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
        new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
        new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
        new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
    ];

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
    dynamicTrendChunkSize = 4;
    dynamicTrendChunkSizeDefault = 4;

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
        const chunk = this.tickerValue.slice(
            this.tickerValue.length - dataChunk, this.tickerValue.length);
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

    rsiTable = [];

    calcRSITableValues() {
        this.rsiTable[0] = this.getRSI14(300, 21);
        this.rsiTable[1] = this.getRSI14(900, 64);
        this.rsiTable[2] = this.getRSI14(1800, 128);
        this.rsiTable[3] = this.getRSI14(2700, 192);
        this.rsiTable[4] = this.getRSI14(3600, 250);
        this.rsiTable[5] = this.getRSI14(11249, 803);
    }

    minCandles = [];
    atr;
    STOP_LOSS_ATR_MULTIPLIER = 1.5;
    candleAnalyze = {
        ema20: 0,
        ema50: 0,
        rsi14: 0,
        atr14: 0,
        trend: "",
        pattern: ""
    };

    updateMinCandles(){
        this.minCandles = this.aggregateToCandles(this.tickerValue);
        this.atr = this.calculateATR(this.minCandles);
        this.candleAnalyze = analyzeCandles(this.minCandles);
        this.sendCandles(this.minCandles[this.minCandles.length - 1]).then(r => console.log(r));
    }

    calculateATR(candles, period = 14) {
        const trList = [];
        for (let i = 1; i < candles.length; i++) {
            const prevClose = candles[i - 1].close;
            const current = candles[i];

            const highLow = current.high - current.low;
            const highClose = Math.abs(current.high - prevClose);
            const lowClose = Math.abs(current.low - prevClose);

            const trueRange = Math.max(highLow, highClose, lowClose);
            trList.push(trueRange);
        }
        // Paprastas vidurkis (SMA), jei nenori EMA
        const atr = trList.slice(-period).reduce((a, b) => a + b, 0) / period;
        return atr;
    }

    aggregateToCandles(data, intervalSeconds = 60) {
        const candles = [];
        let candle = null;
        data.forEach(point => {
            const timestamp = new Date(point.time).getTime();
            const bucket = Math.floor(timestamp / (intervalSeconds * 1000)) * intervalSeconds * 1000;
            if (!candle || candle.timestamp !== bucket) {
                if (candle) candles.push(candle);
                candle = {
                    timestamp: bucket,
                    open: point.indexPrice,
                    high: point.indexPrice,
                    low: point.indexPrice,
                    close: point.indexPrice
                };
            } else {
                candle.high = Math.max(candle.high, point.indexPrice);
                candle.low = Math.min(candle.low, point.indexPrice);
                candle.close = point.indexPrice;
            }
        });
        if (candle) candles.push(candle);
        return candles;
    }

    candle = {
        "timestamp": 1713356400000,
        "open": 50321.23,
        "high": 50321.23,
        "low": 50321.23,
        "close": 50321.23
    }

     sendCandles = async (candle) =>{
        fetch("http://localhost:3000/api/candle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(candle),
        }).then(response => response.json())
            .then(data => {
                console.log('Atsakymas:', data);
            })
            .catch((error) => {
                console.error('Klaida:', error);
            });
    }
}

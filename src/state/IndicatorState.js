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
import {analyzeCandles} from "../indicator/AnalyzeCandles";
import {aggregateToCandles} from "../utils/AggregateToCandles";
import {calculateATRByCandles} from "../indicator/ATR";

export class IndicatorState {

    rootStore = null;
    divergence = "";
    sinusoidCorrelation = 0;
    parabolicCorrelation = 0;
    leftLineCorrelation = 0;
    bullishLineCorrelation = 0
    bearishLineCorrelation = 0;
    trendByPrice = "";
    trendByPrice1min = "";
    dynamicTrendDataLength = 900;
    dynamicTrendChunkSize = 4;
    dynamicTrendChunkSizeDefault = 4;
    aroonTrend = "";
    rsiTable = [];
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
    trailingBuyBots = [];
    trailingBuyBot;
    trailingSellBot;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
        this.trailingBuyBots = [
            new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
            new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
            new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
            new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
            new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
            new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 }),
        ];
        this.trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: 100, trailingPercent: 10 });
        this.trailingSellBot = new TrailingSellBot({ trailingActivateRSI: 10, trailingPercent: 10 });
    }

    calculateDivergence(prices,rsi) {
       this.divergence = checkDivergence(prices, rsi);
    }

    calcSinusoidCorrelation(rsi) {
       this.sinusoidCorrelation = doSinusoidCorrelation(rsi);
    }

    calcParabolicCorrelation(rsi) {
        this.parabolicCorrelation = doParabolicCorrelation(rsi);
    }

    getRSIParabolicCorrelation() {
        return this.parabolicCorrelation;
    }

    getRSI14(prices, size = 300) {
        if(size <= prices.length){
            const rsi = calculateRSI(prices);
            return Number(rsi[rsi.length -1]).toFixed(2);
        }
        return null;
    }

    getParabolicCorrelation(prices, size = 300) {
        if(size <= prices.length){
            return doParabolicCorrelation(prices);
        }
        return null;
    }

    calcLeftLineCorrelation(rsi) {
        this.leftLineCorrelation = doLeftLineCorrelation(rsi);
    }

    calcBullishLineCorrelation(rsi) {
        this.bullishLineCorrelation = doBullishLineCorrelation(rsi);
    }

    calcBearishLineCorrelation(rsi) {
        this.bearishLineCorrelation = doBearishLineCorrelation(rsi);
    }

    updateTrailingBuyBot(){
        if(this.rsiTable){
            this.trailingBuyBots[0].updateRSI(Number(this.rsiTable[0]));
            this.trailingBuyBots[1].updateRSI(Number(this.rsiTable[1]));
            this.trailingBuyBots[2].updateRSI(Number(this.rsiTable[2]));
            this.trailingBuyBots[3].updateRSI(Number(this.rsiTable[3]));
            this.trailingBuyBots[4].updateRSI(Number(this.rsiTable[4]));
            this.trailingBuyBots[5].updateRSI(Number(this.rsiTable[5]));
        }
    }

    calculateDynamicTrend(prices) {
        if(prices.length / this.dynamicTrendChunkSize > 26
            && prices.length > this.dynamicTrendDataLength){
            prices = prices.slice(-this.dynamicTrendDataLength);
            prices = downsampleArray(prices, this.dynamicTrendChunkSize);
            this.trendDynamic = getTrendByEMA(prices);
        }
    }

    calculateTrend(prices, dataLength, chunkSize) {
        if(dataLength / chunkSize > 26
            && prices > dataLength){
            prices = prices.slice(-dataLength);
            prices = downsampleArray(prices, chunkSize);
            return getTrendByEMA(prices);
        }
        return 0;
    }

    calculateAroon(prices, dataLength){
        if(prices.length > dataLength){
            prices = prices.slice(-dataLength);
            const result = calculateAroon(prices, 15);
            const aroonUp = result[0];
            const aroonDown = result[1];
            const diff = (aroonUp[aroonUp.length - 1] - aroonDown[aroonDown.length - 1]).toFixed(2);
            this.aroonTrend = aroonUp[aroonUp.length - 1] > aroonDown[aroonDown.length - 1] ? "up:" + diff : "down:" + diff;
        }
    }

    calcRSITableValues(prices) {
        this.rsiTable[0] = this.getRSI14(prices.slice(-300), 21);
        this.rsiTable[1] = this.getRSI14(prices.slice(-900), 64);
        this.rsiTable[2] = this.getRSI14(prices.slice(-1800), 128);
        this.rsiTable[3] = this.getRSI14(prices.slice(-2700), 192);
        this.rsiTable[4] = this.getRSI14(prices.slice(-3600), 250);
        this.rsiTable[5] = this.getRSI14(prices.slice(-11249), 803);
    }

    updateATR(candles){
        this.atr = calculateATRByCandles(candles);
    }

    updateCandleAnalyzer(candles){
        this.candleAnalyze = analyzeCandles(candles);
    }
}

import {makeAutoObservable} from "mobx";
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
import {TrailingSellBot} from "../indicator/TrailingSellBot";
import {analyzeCandles} from "../indicator/AnalyzeCandles";
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
    dynamicTrendChunkSize = 1;
    dynamicTrendChunkSizeDefault = 1;
    aroonTrend = "";
    rsiTable = [];
    rsi14 = 0;
    minCandles = [];
    atr;
    STOP_LOSS_ATR_MULTIPLIER = 1.5;
    candleAnalyze = {
        ema20: 0.00,
        ema50: 0.00,
        rsi14: 0.00,
        atr14: 0.00,
        trend: "",
        pattern: "",
        signalCon:"",
        signalBal:"",
        signalAgr:"",
        isUpLast3:"",
        isDownLast3:""
    };
    trailingBuyBots = [];
    trailingBuyBot;
    trailingSellBot;
    indicatorCounter = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
        this.trailingBuyBots = [
            new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10}),
            new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10}),
            new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10}),
            new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10}),
            new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10}),
            new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10}),
        ];
        this.trailingBuyBot = new TrailingBuyBot({trailingActivateRSI: 100, trailingPercent: 10});
        this.trailingSellBot = new TrailingSellBot({trailingActivateRSI: 10, trailingPercent: 10});
    }

    calculateDivergence(closePrices) {
        const rsi = calculateRSI(closePrices);
        this.divergence = checkDivergence(closePrices, rsi);
    }

    calcSinusoidCorrelation(closePrices) {
        this.sinusoidCorrelation = doSinusoidCorrelation(closePrices);
    }

    calcParabolicCorrelation(closePrices) {
        this.parabolicCorrelation = doParabolicCorrelation(closePrices);
    }

    getRSI14(closePrices) {
        if (closePrices) {
            const rsi = calculateRSI(closePrices);
            return Number(rsi[rsi.length - 1]).toFixed(2);
        }
        return null;
    }

    calcRSI14(closePrices) {
        this.rsi14 = this.getRSI14(closePrices);
    }

    getParabolicCorrelation(prices, size = 300) {
        if (size <= prices.length) {
            return doParabolicCorrelation(prices);
        }
        return null;
    }

    calcLeftLineCorrelation(closePrices) {
        this.leftLineCorrelation = doLeftLineCorrelation(closePrices);
    }

    calcBullishLineCorrelation(closePrices) {
        this.bullishLineCorrelation = doBullishLineCorrelation(closePrices);
    }

    calcBearishLineCorrelation(closePrices) {
        this.bearishLineCorrelation = doBearishLineCorrelation(closePrices);
    }

    updateTrailingBuyBot() {
        if (this.rsiTable) {
            this.trailingBuyBots[0].updateRSI(Number(this.rsiTable[0]));
            this.trailingBuyBots[1].updateRSI(Number(this.rsiTable[1]));
            this.trailingBuyBots[2].updateRSI(Number(this.rsiTable[2]));
            this.trailingBuyBots[3].updateRSI(Number(this.rsiTable[3]));
            this.trailingBuyBots[4].updateRSI(Number(this.rsiTable[4]));
            this.trailingBuyBots[5].updateRSI(Number(this.rsiTable[5]));
        }
    }

    calculateDynamicTrend(closePrices) {
            this.trendDynamic = getTrendByEMA(closePrices);
    }

    calculateTrend(prices) {
            return getTrendByEMA(prices);
    }

    calculateAroon(closePrices) {
        const aroonUp = closePrices[0];
        const aroonDown = closePrices[1];
        const diff = (aroonUp[aroonUp.length - 1] - aroonDown[aroonDown.length - 1]).toFixed(2);
        this.aroonTrend = aroonUp[aroonUp.length - 1] > aroonDown[aroonDown.length - 1] ? "up:" + diff : "down:" + diff;
    }

    calcRSITableValues(closePrices) {
        this.rsiTable[0] = this.getRSI14(closePrices.slice(-300), 21);
        this.rsiTable[1] = this.getRSI14(closePrices.slice(-900), 64);
        this.rsiTable[2] = this.getRSI14(closePrices.slice(-1800), 128);
        this.rsiTable[3] = this.getRSI14(closePrices.slice(-2700), 192);
        this.rsiTable[4] = this.getRSI14(closePrices.slice(-3600), 250);
        this.rsiTable[5] = this.getRSI14(closePrices.slice(-11249), 803);
    }

    updateATR(candles) {
        const period = 14;
        if (candles.length > period) {
            this.atr = calculateATRByCandles(candles, period);
        }
    }

    updateCandleAnalyzer(candles) {
        const minCandle = 50;
        if (candles.length > minCandle) {
            this.candleAnalyze = analyzeCandles(candles);
        }
    }
}

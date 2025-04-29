import {detectAroonTrend} from "./Aroon";
import {engulfig} from "../strategy/EngulfingStrategy";
import {aroonRSIpattern} from "../strategy/AroonStategy";
import {doParabolicCorrelation} from "./Correletion";

function calculateEMA(candles, period) {
    const k = 2 / (period + 1);
    let ema = candles[0].close;

    for (let i = 1; i < candles.length; i++) {
        ema = candles[i].close * k + ema * (1 - k);
    }
    return ema;
}

function calculateRSI(candles, period = 14) {
    let gains = 0;
    let losses = 0;

    for (let i = candles.length - period; i < candles.length; i++) {
        const change = candles[i].close - candles[i - 1].close;
        if (change > 0) gains += change;
        else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;

    return 100 - 100 / (1 + rs);
}

function calculateATR(candles, period = 14) {
    const trs = [];

    for (let i = 1; i < candles.length; i++) {
        const prevClose = candles[i - 1].close;
        const high = candles[i].high;
        const low = candles[i].low;

        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );
        trs.push(tr);
    }

    const atr = trs.slice(-period).reduce((sum, val) => sum + val, 0) / period;
    return atr;
}

function detectPattern(candles) {
    if (candles.length < 2) return null;

    const prev = candles[candles.length - 2];
    const curr = candles[candles.length - 1];

    const isBullishEngulfing =
        prev.close < prev.open &&
        curr.close > curr.open &&
        curr.open < prev.close &&
        curr.close > prev.open;

    const isBearishEngulfing =
        prev.close > prev.open &&
        curr.close < curr.open &&
        curr.open > prev.close &&
        curr.close < prev.open;

    if (isBullishEngulfing) return "bullish_engulfing";
    if (isBearishEngulfing) return "bearish_engulfing";
    return "sideways";
}

export function getSignal(currentAnalysis, signal){
    let buySignal = currentAnalysis.signalBal === "up"
    let sellSignal = currentAnalysis.signalBal === "down";
    if(signal === "agrSignal"){
        buySignal = currentAnalysis.signalAgr === "up";
        sellSignal = currentAnalysis.signalAgr === "down";
    } else if(signal === "conSignal"){
        buySignal = currentAnalysis.signalCon === "up";
        sellSignal = currentAnalysis.signalCon === "down";
    }else if(signal === "allSignal"){
        buySignal = currentAnalysis.signalBal === "up" || currentAnalysis.signalAgr === "up" || currentAnalysis.signalCon === "up";
        sellSignal = currentAnalysis.signalBal === "down" || currentAnalysis.signalAgr === "down" || currentAnalysis.signalCon === "down";
    }
    return [buySignal, sellSignal];
}

const convertToPrice = (candles) => {
    if(candles.length > 0){
        return candles.map(item => parseFloat(item.close));
    }
    return null;
}

export function analyzeCandles(candles, engulfingType = "def") {
    const rsi14 = calculateRSI(candles, 14);
    const atr14 = calculateATR(candles, 14);

    const ema10 = calculateEMA(candles.slice(-10), 10);
    const ema20 = calculateEMA(candles.slice(-20), 20);
    const ema50 = calculateEMA(candles.slice(-50), 50);

    const emaTrend = ema10 > ema20 ? "up" : "down";

    let pattern;
    if(engulfingType === "agr"){
        pattern = engulfig.agr(candles);
    } else if(engulfingType === "bal"){
        pattern = engulfig.bal(candles);
    } else if(engulfingType === "con"){
        pattern = engulfig.con(candles);
    } else {
        pattern = detectPattern(candles);
    }
    const aroonCfg = {period:14, exp:[60,40]}
    const aroonTrend = detectAroonTrend(candles, aroonCfg.period, aroonCfg.exp);
    const signalCon = aroonRSIpattern.con(candles, rsi14, pattern);
    const signalBal = aroonRSIpattern.bal(candles, rsi14, pattern);
    const signalAgr = aroonRSIpattern.agr(candles, rsi14, pattern);
    const isUpLast3 = candles.slice(-3).every(c => c.close > c.open);
    const isDownLast3 = candles.slice(-3).every(c => c.close < c.open);

    const correlateParabolic = doParabolicCorrelation(convertToPrice(candles.slice(-10)));

    const logs = {
        engulfingType,
        candlesLength: candles.length,
        rsi14: Number(rsi14).toFixed(2),
        atr14: Number(atr14).toFixed(2),
        ema10: Number(ema10).toFixed(2),
        ema20: Number(ema20).toFixed(2),
        ema50: Number(ema50).toFixed(2),
        emaTrend,
        pattern,
        aroonTrend,
        aroonCfg: JSON.stringify(aroonCfg),
        signalCon,
        signalBal,
        signalAgr,
        isUpLast3,
        isDownLast3,
        correlateParabolic:Number(correlateParabolic).toFixed(2)
    };

    return {
        ema10,
        ema20,
        ema50,
        rsi14,
        atr14,
        emaTrend,
        pattern,
        aroonTrend,
        signalCon,
        signalBal,
        signalAgr,
        isUpLast3,
        isDownLast3,
        logs
    };
}


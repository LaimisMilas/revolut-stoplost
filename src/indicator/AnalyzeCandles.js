import {calculateAroonByCandles, detectAroonTrend} from "./Aroon";

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

function isConservative(candles, rsi14, pattern) {
    const period = 25;
    const { aroonUp, aroonDown } = calculateAroonByCandles(candles.slice(-period), period);
    if (
        aroonUp > 70 &&
        aroonDown < 30 &&
        rsi14 < 35 &&
        pattern === "bullish_engulfing"
    ) {
        return "up";
    }
    if (
        aroonDown > 70 &&
        aroonUp < 30 &&
        rsi14 > 65 &&
        pattern === "bearish_engulfing"
    ) {
        return "down";
    }
    return "none"
}

function isBalanced(candles, rsi14, pattern) {
    const period = 14;
    const { aroonUp, aroonDown } = calculateAroonByCandles(candles.slice(-period), period);

    if (
        aroonUp > 60 &&
        aroonDown < 40 &&
        rsi14 < 40 &&
        pattern === "bullish_engulfing"
    ) {
        return "up";
    }
    if (
        aroonDown > 60 &&
        aroonUp < 40 &&
        rsi14 > 60 &&
        pattern === "bearish_engulfing"
    ) {
        return "down";
    }
    return "none"
}

function isAggressive(candles, rsi14, pattern) {
    const period = 10;
    const { aroonUp, aroonDown } = calculateAroonByCandles(candles.slice(-period), period);
    if (
        aroonUp > 55 &&
        aroonDown < 45 &&
        rsi14 < 45 &&
        pattern === "bullish_engulfing"
    ) {
        return "up";
    }
    if (
        aroonDown > 55 &&
        aroonUp < 45 &&
        rsi14 > 55 &&
        pattern === "bearish_engulfing"
    ) {
        return "down";
    }
    return "none"
}

export function analyzeCandles(candles) {
    const rsi14 = calculateRSI(candles, 14);
    const atr14 = calculateATR(candles, 14);

    const ema10 = calculateEMA(candles.slice(-10), 10);
    const ema20 = calculateEMA(candles.slice(-20), 20);
    const ema50 = calculateEMA(candles.slice(-50), 50);

    const isPriceRising =
        candles[candles.length - 1].close > candles[candles.length - 4].close;

    const trend = ema10 > ema20 ? "up" :
        ema10 < ema20 ? "down" :
            isPriceRising ? "up" : "sideways";

    const pattern = detectPattern(candles);
    const aroonTrend = detectAroonTrend(candles, 14, [60,40]);
    const signalCon = isConservative(candles, rsi14, pattern);
    const signalBal = isBalanced(candles, rsi14, pattern);
    const signalAgr = isAggressive(candles, rsi14, pattern);
    const isUpLast3 = candles.slice(-3).every(c => c.close > c.open);
    const isDownLast3 = candles.slice(-3).every(c => c.close < c.open);

    return {
        ema10,
        ema20,
        ema50,
        rsi14,
        atr14,
        trend,
        pattern,
        aroonTrend,
        signalCon,
        signalBal,
        signalAgr,
        isUpLast3,
        isDownLast3
    };
}


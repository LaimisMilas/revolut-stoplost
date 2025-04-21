// AnalyzeCandles.js

function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
    }
    return ema;
}

function calculateRSI(prices, period = 14) {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change >= 0) gains += change;
        else losses -= change;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change >= 0) {
            avgGain = (avgGain * (period - 1) + change) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        } else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) - change) / period;
        }
    }
    const rs = avgGain / (avgLoss || 1e-10);
    return 100 - 100 / (1 + rs);
}

function calculateATR(candles, period = 14) {
    const trs = [];
    for (let i = 1; i < candles.length; i++) {
        const high = candles[i].high;
        const low = candles[i].low;
        const prevClose = candles[i - 1].close;
        const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
        trs.push(tr);
    }
    return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

function detectTrend(candles) {
    const last = candles.slice(-5);
    const highs = last.map(c => c.high);
    const lows = last.map(c => c.low);
    if (highs[4] > highs[3] && highs[3] > highs[2] && lows[4] > lows[3] && lows[3] > lows[2]) {
        return "up";
    }
    if (highs[4] < highs[3] && highs[3] < highs[2] && lows[4] < lows[3] && lows[3] < lows[2]) {
        return "down";
    }
    return "sideways";
}

function detectEngulfing(candles) {
    const [prev, curr] = candles.slice(-2);

   // const bodyPrev = Math.abs(prev.close - prev.open);
   // const bodyCurr = Math.abs(curr.close - curr.open);

    const isBullishEngulfing =
        prev.close < prev.open &&
        curr.close > curr.open &&
        curr.close > prev.close &&     // svarbiau nei praryti visą žvakę
        curr.open <= prev.open;        // leidžiam atsidaryti tame pačiame lygyje ar mažiau

    const isBearishEngulfing =
        prev.close > prev.open &&
        curr.close < curr.open &&
        curr.close < prev.close &&
        curr.open >= prev.open;

    if (isBullishEngulfing) return "bullish_engulfing";
    if (isBearishEngulfing) return "bearish_engulfing";
    return "sideways";
}

export function analyzeCandles(candles) {
    if (candles.length < 50) return null;
    const closes = candles.map(c => Number(c.close));
    return {
        ema20: calculateEMA(closes, 20),
        ema50: calculateEMA(closes, 50),
        rsi14: calculateRSI(closes, 14),
        atr14: calculateATR(candles, 14),
        trend: detectTrend(candles),
        pattern: detectEngulfing(candles)
    };
}


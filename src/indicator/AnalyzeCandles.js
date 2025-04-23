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

export function calculateAroonByCandles(candles, period = 25) {
    if (candles.length < period) {
        throw new Error("Neužtenka žvakių Aroon skaičiavimui");
    }
    const recentCandles = candles.slice(-period);
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    let daysSinceHigh = 0;
    let daysSinceLow = 0;
    for (let i = 0; i < period; i++) {
        const candle = recentCandles[i];
        if (candle.high > highestHigh) {
            highestHigh = candle.high;
            daysSinceHigh = i;
        }
        if (candle.low < lowestLow) {
            lowestLow = candle.low;
            daysSinceLow = i;
        }
    }
    const aroonUp = ((period - daysSinceHigh) / period) * 100;
    const aroonDown = ((period - daysSinceLow) / period) * 100;
    return {
        aroonUp: +aroonUp.toFixed(2),
        aroonDown: +aroonDown.toFixed(2)
    };
}

function detectAroonTrend(candles) {
    const { aroonUp, aroonDown } =  calculateAroonByCandles(candles.slice(-25), 25);
    if (aroonUp > 70 && aroonDown < 30) {
       return "up";// console.log("Galimas kilimo trendas");
    } else if (aroonDown > 70 && aroonUp < 30) {
        return "down";// console.log("Galimas kritimo trendas");
    } else {
        return "sideways"; //console.log("Aiškaus trendo nėra");
    }
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
    const aroonTrend = detectAroonTrend(candles);

    return {
        ema10,
        ema20,
        ema50,
        rsi14,
        atr14,
        trend,
        pattern,
        aroonTrend
    };
}


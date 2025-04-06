export function calculateATR(highs, lows, closes, period = 14) {
    const trs = [];

    for (let i = 1; i < highs.length; i++) {
        const high = highs[i];
        const low = lows[i];
        const prevClose = closes[i - 1];

        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );

        trs.push(tr);
    }

    // Pirmas ATR = SMA(TR, period)
    let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const result = [atr];

    // Likę – kaip EMA
    const k = 2 / (period + 1);
    for (let i = period; i < trs.length; i++) {
        atr = trs[i] * k + atr * (1 - k);
        result.push(atr);
    }

    return result;
}

function convertData(rawData){
    const highs = rawData.map(item => item.h[1]);
    const lows = rawData.map(item => item.l[1]);
    const closes = rawData.map(item => item.c[1]);
    return [highs,lows,closes];
}

export function calcStopLostTakeProf(entryPrice = 105, data , trend = "up"){
    const a = convertData(data);
    const atrValues = calculateATR(a[0], a[1], a[2], 14);
    const atrNow = atrValues[atrValues.length - 1];
    return calculateTP_SL(Number(entryPrice), Number(atrNow), trend);
}

function calculateTP_SL(currentPrice, atrValue, trend = 'up') {
    const multiplier = 1.5; // gali koreguoti
    if (trend === 'up') {
        return {
            stopLoss: returnPercent(currentPrice,(currentPrice - atrValue), 'sl'),
            takeProfit: returnPercent(currentPrice, (currentPrice + atrValue * multiplier),'tp')
        };
    } else {
        return {
            stopLoss: returnPercent(currentPrice,(currentPrice + atrValue),'sl'),
            takeProfit: returnPercent(currentPrice,(currentPrice - atrValue * multiplier),'tp')
        };
    }
}

function returnPercent(currentPrice, newPrice, trend){
    let diff = newPrice - currentPrice;
    return  (diff * 100) / currentPrice;
}
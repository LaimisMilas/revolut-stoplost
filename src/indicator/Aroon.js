export const calculateAroon = (prices, period = 14) => {
    if (prices.length < period) {
        throw new Error("Duomenų kiekis turi būti didesnis už periodą.");
    }

    const aroonUp = [];
    const aroonDown = [];

    for (let i = 0; i <= prices.length - period; i++) {
        const periodPrices = prices.slice(i, i + period);
        const highestPrice = Math.max(...periodPrices);
        const lowestPrice = Math.min(...periodPrices);

        const lastHighIndex = periodPrices.lastIndexOf(highestPrice);
        const lastLowIndex = periodPrices.lastIndexOf(lowestPrice);

        const upValue = ((period - lastHighIndex) / period) * 100;
        const downValue = ((period - lastLowIndex) / period) * 100;

        aroonUp.push(upValue);
        aroonDown.push(downValue);
    }

    return [ aroonUp, aroonDown ];
};

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

export function detectAroonTrend(candles, period = 14, exp = [60, 40]) {
    const { aroonUp, aroonDown } = calculateAroonByCandles(candles.slice(-period), period);
    let trend = "sideways";
    if (aroonUp > exp[0] && aroonDown < exp[1]) {
        trend = "up";
    } else if (aroonDown > exp[0] && aroonUp < exp[1]) {
        trend = "down";
    }
    return trend;
}

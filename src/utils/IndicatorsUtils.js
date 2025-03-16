function calculateEMA(data, period) {
    let multiplier = 2 / (period + 1);
    let ema = [data[0]]; // Pradinė EMA reikšmė yra pirmasis duomenų taškas

    for (let i = 1; i < data.length; i++) {
        let value = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
        ema.push(value);
    }
    return ema;
}

export function findMACDCrossovers(prices) {
    let ema12 = calculateEMA(prices, 12);
    let ema26 = calculateEMA(prices, 26);
    let macd = ema12.map((val, i) => val - ema26[i]);
    let signal = calculateEMA(macd, 9);

    let crossovers = [];

    for (let i = 1; i < macd.length; i++) {
        if (macd[i - 1] < signal[i - 1] && macd[i] > signal[i]) {
            crossovers.push({ index: i, type: "bullish", price: prices[i] });
        } else if (macd[i - 1] > signal[i - 1] && macd[i] < signal[i]) {
            crossovers.push({ index: i, type: "bearish", price: prices[i] });
        }
    }
    return crossovers;
}
import {convertToNumber} from "../utils/RevolutUtils";

export const calculateRSI = (prices, period = 14) => {
    if (prices.length < period) {
        throw new Error("Not enough data to calculate RSI.");
    }

    let gains = [];
    let losses = [];

    // Pirmas ciklas: surenkam pradinius pelnus/nuostolius
    for (let i = 1; i < period + 1; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
    }

    // Apskaičiuojame pradinius vidurkius
    let avgGain = gains.reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.reduce((a, b) => a + b, 0) / period;

    let rsiValues = [100 - (100 / (1 + (avgGain / avgLoss)))];

    // Tolimesni skaičiavimai pagal Wilder’s smoothed RSI formulę
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? Math.abs(change) : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        rsiValues.push(rsi);
    }

    return rsiValues;
};

export const isRSIDown = async (tradePare, rsiValue) => {
    if (rsiValue > 0) {
        let assetValue = tradePare.rsi;
        return rsiValue <= convertToNumber(assetValue);
    }
    return false;
}
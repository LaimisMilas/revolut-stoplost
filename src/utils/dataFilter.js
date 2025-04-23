export const medianFilter = (data, windowSize = 3) => {
    if (data.length < windowSize) return data; // Jei per mažai duomenų, nieko nekeičiam.

    const halfWindow = Math.floor(windowSize / 2);
    return data.map((_, i, arr) => {
        const start = Math.max(0, i - halfWindow);
        const end = Math.min(arr.length, i + halfWindow + 1);
        const window = arr.slice(start, end).sort((a, b) => a - b);
        return window[Math.floor(window.length / 2)];
    });
};

export const removeOutliersZScore = (data, threshold = 1) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / data.length);

    return data.map((x, i, arr) => {
        const zScore = Math.abs((x - mean) / stdDev);
        if (zScore > threshold) {
            return i > 0 ? arr[i - 1] : mean; // Pakeičiame į ankstesnę reikšmę arba vidurkį
        }
        return x;
    });
};

const removeOutliersZScore2 = (data, threshold = 3) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / data.length);

    return data.map((value, i) => {
        const zScore = Math.abs((value - mean) / stdDev);
        return zScore > threshold ? data[i - 1] || value : value; // Pakeičiame ankstesne verte
    });
};

export function simpleMovingAverage(data, period) {
    return data.map((val, idx, arr) => {
        if (idx < period - 1) return val; // Nepakankamai duomenų vidurkiui
        const subset = arr.slice(idx - period + 1, idx + 1);
        return subset.reduce((sum, num) => sum + num, 0) / period;
    });
}

export const movingAverage = (data, windowSize = 5) => {
    return data.map((_, i, arr) => {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(arr.length, i + Math.floor(windowSize / 2) + 1);
        const window = arr.slice(start, end);
        return window.reduce((a, b) => a + b, 0) / window.length;
    });
};

export const cleanData = (rawData) => {
    let cleanedData = removeOutliersZScore(rawData, 0.5);
    cleanedData = medianFilter(cleanedData);
    return movingAverage(cleanedData);
}

const findJumps = (prices, threshold = 1) => {
    let jumps = [];

    for (let i = 1; i < prices.length; i++) {
        const change = Math.abs(prices[i] - prices[i - 1]);
        if (change > threshold) {
            jumps.push({ index: i, from: prices[i - 1], to: prices[i], change });
        }
    }

    return jumps;
};

export function downsampleArray(data, chunkSize) {
    let result = [];

    for (let i = 0; i < data.length; i += chunkSize) {
        let chunk = data.slice(i, i + chunkSize);
        let avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
        result.push(avg);
    }

    return result;
}

const prices = [
    60.33,60.47,60.61,60.57,60.44,59.91,60.06,60.06,60.06,59.87,59.87,59.87,60.19,60.22,60.22,
    60.49,60.38,60.17,60.17,60.17,60.35,60.67,60.25,60.26,60.36,60.26,60.4,60.4,60.55,60.44,
    60.62,60.69,60.46,60.71,60.83,60.83,60.83,60.83,60.73,60.85,60.89,61.02,60.78,60.78,60.78,
    60.78,60.78,60.78,60.78,60.99,60.79,60.69,60.9,61.55,61.44,61.44,61.44,61.35,61.35,60.97,
    60.97,61.04,61.04,61.04,61.04,61.04,61.04,40.15,40.15,40.14,61.29,60.87,61.43,61.5,61.85,
    61.85,61.89,61.87,61.98,61.94,61.85,61.73,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,
    61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,
    61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,
    61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,
    61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63,
    61.63,61.63,61.63,61.63,61.63,61.63,61.63,61.63];

//findJumps(prices, 2)
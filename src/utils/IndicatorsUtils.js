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


export function simpleMovingAverage(data, period) {
    return data.map((val, idx, arr) => {
        if (idx < period - 1) return val; // Nepakankamai duomenų vidurkiui
        const subset = arr.slice(idx - period + 1, idx + 1);
        return subset.reduce((sum, num) => sum + num, 0) / period;
    });
}

export function findDivergence(prices, rsi) {
    const len = prices.length;
    if (prices[len - 1] < prices[len - 2] && rsi[len - 1] > rsi[len - 2]) {
        return "Bullish divergencija - galima kilimo pradžia!";
    }
    if (prices[len - 1] > prices[len - 2] && rsi[len - 1] < rsi[len - 2]) {
        return "Bearish divergencija - galima korekcija!";
    }
    return "Divergencijos nėra.";
}

export function detectFractalPattern(rsi, caller) {
    const len = rsi.length;
    if (rsi[len - 3] > rsi[len - 2] && rsi[len - 1] > rsi[len - 2]) {
        return caller+ " W dugnas - bullish signalas!";
    }
    if (rsi[len - 3] < rsi[len - 2] && rsi[len - 1] < rsi[len - 2]) {
        return caller + " M viršūnė - bearish signalas!";
    }
    return caller + " Fraktalinio modelio nėra.";
}

export const pearsonCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    const sumX2 = x.map(xi => xi ** 2).reduce((a, b) => a + b, 0);
    const sumY2 = y.map(yi => yi ** 2).reduce((a, b) => a + b, 0);
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
    return denominator === 0 ? 0 : numerator / denominator;
}

export const doParabolicCorrelation = (rsi5Value, caller) => {

    // RSI14 paskutinės 10 reikšmių
    // const rsiValues = [30, 28, 27, 26, 25, 26, 28, 30, 33, 36];
    const rsiValues = rsi5Value;

    // Sukuriame parabolės formą su x^2
    const xValues = [...Array(rsi5Value.length).keys()]; // [0, 1, 2, ..., 9]
    const parabolicValues = xValues.map(x => 0.5 * x ** 2 - 4 * x + 30); // a=0.5, b=-4, c=30

    // Apskaičiuojame koreliaciją
    const correlation = pearsonCorrelation(rsiValues, parabolicValues);

    console.log(caller + " Koreliacija su parabole:", correlation);

    if (correlation > 0.8) {
        console.log(caller + " Rinka gali keisti kryptį į viršų!");
    } else if (correlation < -0.8) {
        console.log(caller + " Rinka gali keisti kryptį į apačią!");
    } else {
        console.log(caller + " Nėra aiškios krypties.");
    }

    return correlation;
}


// Funkcija, kuri sugeneruoja parabolę su dviejų krypčių šakomis
function customParabola(x, pivot, a1, b1, c1, a2, b2, c2) {
    if (x < pivot) {
        return a1 * x * x + b1 * x + c1; // Pirma šaka (į viršų)
    } else {
        return a2 * x * x + b2 * x + c2; // Antra šaka (į apačią)
    }
}

// Koreliacijos skaičiavimas (Pearson metodas)
function calculateCorrelation(arr1, arr2) {
    if (arr1.length !== arr2.length) return null;

    let n = arr1.length;
    let sum1 = arr1.reduce((a, b) => a + b, 0);
    let sum2 = arr2.reduce((a, b) => a + b, 0);
    let sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
    let sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
    let pSum = arr1.reduce((acc, val, i) => acc + val * arr2[i], 0);

    let num = pSum - (sum1 * sum2 / n);
    let den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    return den === 0 ? 0 : num / den;
}

// Funkcija, kuri analizuoja RSI duomenis ir pateikia pirkimo/pardavimo signalus
export function analyzeMarket(rsiData, caller) {
    let pivot = Math.floor(rsiData.length / 2); // Pivot taškas viduryje
    let parabolaData = rsiData.map((_, i) => customParabola(i, pivot, 0.01, -1, 20, -0.01, 1, 100));

    let correlation = calculateCorrelation(rsiData, parabolaData);

    console.log(`${caller} Koreliacija su parabole: ${correlation.toFixed(2)}`);

    let lastRSI = rsiData[rsiData.length - 1];

    if (lastRSI < 30 && correlation > 0.85) {
        console.log(caller + " 🔵 SIGNALAS: PIRKTI (RSI žemas ir stipri koreliacija)");
    } else if (lastRSI > 70 && correlation < -0.8) {
        console.log(caller + " 🔴 SIGNALAS: PARDUOTI (RSI aukštas ir stipri koreliacija)");
    } else {
        console.log(caller + " ⚪ SIGNALAS: LAUKTI (Nėra aiškios tendencijos)");
    }
}

// Funkcija, kuri sugeneruoja tiesę pagal duomenų ilgį
function generateLineData(length, slope, intercept) {
    return Array.from({ length }, (_, i) => slope * i + intercept);
}

// Koreliacijos skaičiavimas (Pearson metodas)
function calculateCorrelationByLine(arr1, arr2) {
    if (arr1.length !== arr2.length) return null;

    let n = arr1.length;
    let sum1 = arr1.reduce((a, b) => a + b, 0);
    let sum2 = arr2.reduce((a, b) => a + b, 0);
    let sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
    let sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
    let pSum = arr1.reduce((acc, val, i) => acc + val * arr2[i], 0);

    let num = pSum - (sum1 * sum2 / n);
    let den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    return den === 0 ? 0 : num / den;
}

// Funkcija, kuri analizuoja RSI duomenis ir pateikia signalus
export function analyzeMarketLine(rsiData, caller) {
    let slope = (rsiData[rsiData.length - 1] - rsiData[0]) / rsiData.length; // Tiesės nuolydis
    let intercept = rsiData[0]; // Pradinė reikšmė
    let lineData = generateLineData(rsiData.length, slope, intercept); // Generuoja tiesę

    let correlation = calculateCorrelationByLine(rsiData, lineData);

    console.log(`${caller} Koreliacija su tiesę: ${correlation.toFixed(2)}`);

    let lastRSI = rsiData[rsiData.length - 1];

    if (lastRSI < 30 && correlation > 0.85) {
        console.log(caller + " 🔵 SIGNALAS: PIRKTI (RSI žemas ir stipri koreliacija)");
    } else if (lastRSI > 70 && correlation < -0.8) {
        console.log(caller + " 🔴 SIGNALAS: PARDUOTI (RSI aukštas ir stipri koreliacija)");
    } else {
        console.log(caller + " ⚪ SIGNALAS: LAUKTI (Nėra aiškios tendencijos)");
    }
}


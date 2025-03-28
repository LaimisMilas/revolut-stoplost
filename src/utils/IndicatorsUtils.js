
export function checkDivergence(prices, rsi) {
    if (prices[prices.length - 1] < prices[prices.length - 2] && rsi[rsi.length - 1] > rsi[rsi.length - 2]) {
        return 'bullish';
    }
    if (prices[prices.length - 1] > prices[prices.length - 2] && rsi[rsi.length - 1] < rsi[rsi.length - 2]) {
        return 'bearish';
    }
    return "none divergence";
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


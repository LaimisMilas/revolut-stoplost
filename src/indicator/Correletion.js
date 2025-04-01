import {generateBearishLine, generateBullishLine, generateLeftLine, generateSineWaveData} from "../utils/wave";

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

export const doParabolicCorrelation = (rsiValues) => {
    const n = rsiValues.length;
    if (n < 3) {
        console.error("RSI reikšmių per mažai, reikia bent 3.");
        return 0;
    }
    // Generuojame X reikšmes: simetriškai aplink nulį
    const xValues = Array.from({ length: n }, (_, i) => i - Math.floor(n / 2));
    // Parabolės funkcija: y = a*x^2 + c
    const a = 0.5; // Reguliuojamas kreivumo koeficientas
    const c = 1;   // Vertikalus poslinkis
    const parabolicValues = xValues.map(x => a * x ** 2 + c);
    // Skaičiuojame koreliaciją
    const correlation = pearsonCorrelation(rsiValues, parabolicValues);
    return Number(correlation).toFixed(2);
};

export const doSinusoidCorrelation = (rsiValues) => {
    const n = rsiValues.length;
    if (n < 3) {
        console.error("RSI reikšmių per mažai, reikia bent 3.");
        return 0;
    }
    const sinusoidValues = generateSineWaveData(rsiValues.length-1, 10)
    const correlation = pearsonCorrelation(rsiValues, sinusoidValues);
    return Number(correlation).toFixed(2);
};

export const doBullishLineCorrelation = (rsiValues) => {
    const n = rsiValues.length;
    if (n < 3) {
        console.error("RSI reikšmių per mažai, reikia bent 3.");
        return 0;
    }
    const bullishLineValues = generateBullishLine(rsiValues.length-1);
    const correlation = pearsonCorrelation(rsiValues, bullishLineValues);
    return Number(correlation).toFixed(2);
};

export const doBearishLineCorrelation = (rsiValues) => {
    const n = rsiValues.length;
    if (n < 3) {
        console.error("RSI reikšmių per mažai, reikia bent 3.");
        return 0;
    }
    const bearishLineValues = generateBearishLine(rsiValues.length-1);
    const correlation = pearsonCorrelation(rsiValues, bearishLineValues);
    return Number(correlation).toFixed(2);
};

export const doLeftLineCorrelation = (rsiValues) => {
    const n = rsiValues.length;
    if (n < 3) {
        console.error("RSI reikšmių per mažai, reikia bent 3.");
        return 0;
    }
    const leftLineValues = generateLeftLine(rsiValues.length-1);
    const correlation = pearsonCorrelation(rsiValues, leftLineValues);
    return Number(correlation).toFixed(2);
};





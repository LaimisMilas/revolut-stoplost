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

export const doParabolicCorrelation = (values) => {
    const n = values.length;
    if (n < 3) {
        return 0;
    }
    const xValues = Array.from({ length: n }, (_, i) => i - Math.floor(n / 2));
    const a = 0.5;
    const c = 1;
    const parabolicValues = xValues.map(x => a * x ** 2 + c);
    const correlation = pearsonCorrelation(values, parabolicValues);
    return Number(correlation).toFixed(2);
};

export const doSinusoidCorrelation = (values) => {
    const n = values.length;
    if (n < 3) {
        return 0;
    }
    const sinusoidValues = generateSineWaveData(values.length-1, 10)
    const correlation = pearsonCorrelation(values, sinusoidValues);
    return Number(correlation).toFixed(2);
};

export const doBullishLineCorrelation = (values) => {
    const n = values.length;
    if (n < 3) {
        return 0;
    }
    const bullishLineValues = generateBullishLine(values.length-1);
    const correlation = pearsonCorrelation(values, bullishLineValues);
    return Number(correlation).toFixed(2);
};

export const doBearishLineCorrelation = (values) => {
    const n = values.length;
    if (n < 3) {
        return 0;
    }
    const bearishLineValues = generateBearishLine(values.length-1);
    const correlation = pearsonCorrelation(values, bearishLineValues);
    return Number(correlation).toFixed(2);
};

export const doLeftLineCorrelation = (values) => {
    const n = values.length;
    if (n < 3) {
        return 0;
    }
    const lineValues = generateLeftLine(values.length-1);
    const correlation = pearsonCorrelation(values, lineValues);
    return Number(correlation).toFixed(2);
};





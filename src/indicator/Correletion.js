
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

export const doParabolicCorrelation = (rsiValues, caller) => {
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

    console.log(`${caller} Koreliacija su parabole:`, correlation.toFixed(3));

    return correlation;
};
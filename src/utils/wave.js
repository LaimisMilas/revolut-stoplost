
export const generateSineWaveData = (numPoints = 100, amplitude = 1, period = 10) => {
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * period; // Normalizuotas x intervalas
        const y = amplitude * Math.sin((2 * Math.PI / period) * x);
        data.push(y);
    }
    return data;
};

// y=k*x
// kai k = 0
// kai k > 0 bullish
//kai k < bearish
export const generateBullishLine = (numPoints = 6) => {
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
        const x = 2;
        const k = i;
        const y = k * x;
        data.push(y);
    }
    return data;
};

export const generateBearishLine = (numPoints = 6) => {
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
        const x = 2;
        const k = i * (-1);
        const y = k * x;
        data.push(y);
    }
    return data;
};

export const generateLeftLine = (numPoints = 6) => {
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
        const x = 2;
        const k = 0;
        const y = k * x;
        data.push(y);
    }
    return data;
};


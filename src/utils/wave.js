
export const generateSineWaveData = (numPoints = 100, amplitude = 1, period = 10) => {
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * period; // Normalizuotas x intervalas
        const y = amplitude * Math.sin((2 * Math.PI / period) * x);
        data.push(y);
    }
    return data;
};
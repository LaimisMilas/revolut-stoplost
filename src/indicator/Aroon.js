export const calculateAroon = (prices, period = 14) => {
    if (prices.length < period) {
        throw new Error("Duomenų kiekis turi būti didesnis už periodą.");
    }

    const aroonUp = [];
    const aroonDown = [];

    for (let i = 0; i <= prices.length - period; i++) {
        const periodPrices = prices.slice(i, i + period);
        const highestPrice = Math.max(...periodPrices);
        const lowestPrice = Math.min(...periodPrices);

        const lastHighIndex = periodPrices.lastIndexOf(highestPrice);
        const lastLowIndex = periodPrices.lastIndexOf(lowestPrice);

        const upValue = ((period - lastHighIndex) / period) * 100;
        const downValue = ((period - lastLowIndex) / period) * 100;

        aroonUp.push(upValue);
        aroonDown.push(downValue);
    }

    return [ aroonUp, aroonDown ];
};
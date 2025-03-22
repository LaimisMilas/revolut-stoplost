//data.slice(0, period) → paima pirmas period reikšmes iš duomenų masyvo.
//    .reduce((a, b) => a + b) → susumuoja šias reikšmes.
// period → padalina iš period, kad gautų vidurkį.
//EMA (Exponential Moving Average)
//SMA (Simple Moving Average)

export function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    const dataByPeriod = data.slice(0, period);
    const valueSum = dataByPeriod.reduce((a, b) => a + b);
    let emaPrev = valueSum / period;  // Čia pirmas SMA, kuris tampa pirmu EMA tašku
    const ema = [emaPrev];
    for (let i = period; i < data.length; i++) {
        emaPrev = data[i] * k + emaPrev * (1 - k);  // Skaičiuojama EMA
        ema.push(emaPrev);
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
            crossovers.push({index: i, type: "bullish", price: prices[i]});
        } else if (macd[i - 1] > signal[i - 1] && macd[i] < signal[i]) {
            crossovers.push({index: i, type: "bearish", price: prices[i]});
        }
    }

    return crossovers;
}

function getLastCrossovers(prices) {
    const crossovers = findMACDCrossovers(prices);
    if (crossovers.length > 0) {
        return crossovers[crossovers.length - 1];
    }
    return [];
}

function isLastCrossBearish(prices) {
    const lastCross = getLastCrossovers(prices);
    if (lastCross) {
        return lastCross.type === "bearish";
    }
}

function getCurrentMACD(prices) {

    if (isLastCrossBearish(prices)) {
        let ema12 = calculateEMA(prices, 12);
        let ema26 = calculateEMA(prices, 26);
        let macd = ema12.map((val, i) => val - ema26[i]);
        let signal = calculateEMA(macd, 9);

        let crossovers = [];
        for (let i = 1; i < macd.length; i++) {
            if (macd[i - 1] < signal[i - 1] && macd[i] > signal[i]) {
                crossovers.push({index: i, type: "bullish", price: prices[i]});
            } else if (macd[i - 1] > signal[i - 1] && macd[i] < signal[i]) {
                crossovers.push({index: i, type: "bearish", price: prices[i]});
            }
        }

        let lastCross;

        if (crossovers.length > 0) {
            lastCross = crossovers[crossovers.length - 1];
        }

        let result;

        if (lastCross) {
            result = {
                type: lastCross.type,
                priceCross: lastCross.price,
                ema12: ema12[ema12.length - 1],
                ema26: ema26[ema26.length - 1],
                macd: macd[macd.length - 1],
                signal: signal[signal.length - 1]
            }
        }

        return result;
    }
}

export const calculateMACD = (prices) => {
    if (prices.length < 26) {
        throw new Error("Duomenų per mažai MACD skaičiavimui.");
    }

    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);

    // Apkarpome ema12, kad ilgiai atitiktų ema26
    const ema12Trimmed = ema12.slice(ema12.length - ema26.length);

    // Skaičiuojame MACD liniją
    const macdLine = ema12Trimmed.map((ema, i) => ema - ema26[i]);

    // Skaičiuojame signalinę liniją (9 periodų EMA iš MACD linijos)
    const signalLine = calculateEMA(macdLine, 9);

    // Rasti paskutinį MACD ir signalinės linijos susikirtimą
    let lastCross = null;
    for (let i = 1; i < macdLine.length; i++) {
        if (macdLine[i - 1] < signalLine[i - 1] && macdLine[i] > signalLine[i]) {
            lastCross = "Bullish"; // Kirtimas į viršų
        } else if (macdLine[i - 1] > signalLine[i - 1] && macdLine[i] < signalLine[i]) {
            lastCross = "Bearish"; // Kirtimas žemyn
        }
    }
    // Patikrinti, ar EMA12 yra labiausiai nutolęs nuo nulio
    const ema12MaxDistance = Math.max(...ema12Trimmed.map(Math.abs));
    const ema12Trend = Math.abs(ema12Trimmed[ema12Trimmed.length - 1]) === ema12MaxDistance
        ? (ema12Trimmed[ema12Trimmed.length - 1] > 0 ? "Aukščiausias teigiamas EMA12" : "Žemiausias neigiamas EMA12")
        : "Vidutinėje zonoje";

    return { macdLine, signalLine, lastCross, ema12Trend };
};

function test(){
    // Naudojimas
    const prices = [60.33, 60.47, 60.61, 60.57, 60.44, 59.91, 60.06, 60.06, 60.06, 59.87, 59.87, 59.87, 60.19, 60.22, 60.22, 60.49, 60.38, 60.17, 60.17, 60.17, 60.35, 60.67, 60.25, 60.26, 60.36, 60.26, 60.4, 60.4, 60.55, 60.44, 60.62, 60.69, 60.46, 60.71, 60.83, 60.83, 60.83, 60.83, 60.73, 60.85, 60.89, 61.02, 60.78, 60.78, 60.78, 60.78, 60.78, 60.78, 60.78, 60.99, 60.79, 60.69, 60.9, 61.55, 61.44, 61.44, 61.44, 61.35, 61.35, 60.97, 60.97, 61.04, 61.04, 61.04, 61.04, 61.04, 61.04, 40.15, 40.15, 40.14, 61.29, 60.87, 61.43, 61.5, 61.85, 61.85, 61.89, 61.87, 61.98, 61.94, 61.85, 61.73, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63, 61.63];
    const { macdLine, signalLine, lastCross, ema12Trend } = calculateMACD(prices);
    console.log("MACD Susikirtimas:", lastCross);
    console.log("EMA12 Nutolimas:", ema12Trend);
}







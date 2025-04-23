const fs = require('fs');
const path = require('path');
const analyzeCandles = require('../src/indicator/AnalyzeCandlesNode');

async function runBacktest() {
    try {
        const candles = JSON.parse(fs.readFileSync(path.join(__dirname, 'candles.json'), 'utf8'));
        let balance = 3000; // SOL
        let position = null;
        let results = [];

        for (let i = 50; i < candles.length; i++) {
            const history = candles.slice(i - 50, i);
            const current = candles[i];

            if(!current.open || !current.high || !current.low || !current.close) {
                continue;
            }

            const analysis = analyzeCandles(history);

            const price = current.close;

            if (!position) {
                const shouldBuy =
                    analysis.trend === "up" &&
                    analysis.rsi14 < 70 &&
                    analysis.pattern === "bullish_engulfing";

                if (shouldBuy) {
                    const atr = analysis.atr14 || 0.5; // fallback
                    position = {
                        entry: price,
                        stop: price - atr * 1.5,
                        target: price + atr * 2.5,
                        timestamp: current.timestamp
                    };
                    results.push({
                        action: "BUY",
                        date: new Date(current.timestamp).toLocaleDateString("eu-LT"),
                        time: new Date(current.timestamp).toLocaleTimeString("eu-LT"),
                        price:  Number(price).toFixed(2),
                        rsi14: analysis.rsi14.toFixed(2),
                        trend: analysis.trend,
                        pattern: analysis.pattern,
                    });
                }
            } else {
                const reachedTakeProfit = price >= position.target;
                const trendIsDown = analysis.trend === "down";
                const rsiIsHigh = analysis.rsi14 > 30;
                const bearishPattern = analysis.pattern === "bearish_engulfing";

                const shouldSell =
                    (reachedTakeProfit && trendIsDown) ||
                    rsiIsHigh ||
                    bearishPattern ||
                    price <= position.stop;

                if (shouldSell) {
                    const sellPrice = price <= position.stop ? position.stop : price;
                    const profit = ((sellPrice - position.entry) / position.entry) * balance;
                    balance += profit;
                    results.push({
                        action: price <= position.stop ? "STOP_LOSS" : "SELL",
                        date: new Date(current.timestamp).toLocaleDateString("eu-LT"),
                        time: new Date(current.timestamp).toLocaleTimeString("eu-LT"),
                        price: Number(sellPrice).toFixed(2),
                        profit: profit.toFixed(2),
                        balance: balance.toFixed(2),
                        rsi14: analysis.rsi14.toFixed(2),
                        trend: analysis.trend,
                        pattern: analysis.pattern
                    });
                    position = null;
                }
            }
        }

        // Pabaiga
        console.log("\n=== BACKTEST REZULTATAI ===");
        console.log(`🔁 Įkelta ${candles.length} žvakių iš DB`);
        console.log("Sandorių:", results.filter(r => r.action !== "BUY").length);
        console.log("Galutinis balansas (SOL):", balance.toFixed(4));
       // console.table(results);

        let candlesa = [];
        candles.forEach((candle) => {
            candle.date = new Date(candle.timestamp).toLocaleDateString("eu-LT");
            candle.time = new Date(candle.timestamp).toLocaleTimeString("eu-LT");
            candlesa.push(candle);
        })
        console.table(candlesa.slice(-1));

console.table(results); // paskutiniai 10 įrašų

    } catch (error) {
        console.error("❌ Klaida skaitant iš DB:", error);
    }
}


// 🚀 Paleidžiam backtest
runBacktest().then(r => console.log(r));
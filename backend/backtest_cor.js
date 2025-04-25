const fs = require('fs');
const path = require('path');
const { getCandlesFromDB, deleteCandle} = require("./database");
const analyzeCandles = require('../src/indicator/AnalyzeCandlesNode');
const aggregateToCandles2 = require("../src/utils/AggregateToCandlesNode");
const {getTickers} = require("./models/tickerModel");
const {ReversalStrategy} = require("./strategys/ReversalStrategy");
const {strategyCondition} = require("./strategys/StrategyConditions");
const {SellState, getPosition, sellState, pushOrder} = require("./SellState");

const isConfirmationBuy = (prevAnalysis, currentCandle, prevCandle) => {
    if (!prevAnalysis || !prevCandle) return false;
    return prevAnalysis &&
        prevAnalysis.trend === "up" &&
        ["up", "sideways"].includes(prevAnalysis.aroonTrend) &&
        prevAnalysis.rsi14 < 65 &&
        ["bullish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
        currentCandle.close >= prevCandle.close;
};

const isConfirmationSell = (prevAnalysis, currentCandle, prevCandle) => {
    if (!prevAnalysis || !prevCandle) return false;
    return prevAnalysis &&
        prevAnalysis.trend === "down" &&
        ["down", "sideways"].includes(prevAnalysis.aroonTrend) &&
        prevAnalysis.rsi14 > 35 &&
        ["bearish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
        currentCandle.close <= prevCandle.close;
};

const runBacktest = async () => {
    try {

        const tickers = await getTickers(11250*1.5);
        let candles = await aggregateToCandles2(tickers, 60*1);
        let balance = 3000; // SOL
        let results = [];
        let prevAnalysisRef = {current: null};
        let prevCandleRef = {current: null};
        let position = {entry:0};

        for (let i = 50; i < candles.length; i++) {

            const history = candles.slice(i - 50, i);
            const current = candles[i];

            if (!current.open || !current.high || !current.low || !current.close) {
                continue;
            }

            const currentCandle = candles[i];
            const currentAnalysis = analyzeCandles(history);

            const price = currentCandle.close;

            const prevAnalysis = prevAnalysisRef.current;
            const prevCandle = prevCandleRef.current;

            const confirmationBuy = isConfirmationBuy(
                prevAnalysis, currentCandle, prevCandle
            );

            if (position.entry === 0 && confirmationBuy) {
                const opResult = 1 //await buyOperation(tradePare);
                if (opResult > 0) {
                    const atr = currentAnalysis.atr14 || 0.5;
                    position = {
                        entry: price,
                        stop: price - atr * 1.5,
                        target: price + atr * 2.0,
                        timestamp: currentCandle.timestamp
                    };
                    results.push({
                        action: "BUY",
                        date: new Date(currentCandle.timestamp).toLocaleDateString("eu-LT"),
                        time: new Date(currentCandle.timestamp).toLocaleTimeString("eu-LT"),
                        price: Number(price).toFixed(2),
                        rsi14: currentAnalysis.rsi14.toFixed(2),
                        trend: currentAnalysis.trend,
                        aroonTrend: currentAnalysis.aroonTrend,
                        pattern: currentAnalysis.pattern,
                    });
                }
            } else if (position.entry !== 0) {
                const reachedTakeProfit = price >= position.target;
                const trendIsDown = currentAnalysis.trend === "down";
                const rsiIsHigh = currentAnalysis.rsi14 > 30;
                const bearishPattern = currentAnalysis.pattern === "bearish_engulfing";
                const profitPercent = (price - position.entry) / position.entry * 100;
                const confirmationSell = isConfirmationSell(
                    prevAnalysis, currentCandle, prevCandle, position
                );
                const isStopLost = price <= position.stop;
                const v1 = (reachedTakeProfit // tikslas pasiektas
                    && (trendIsDown || currentAnalysis.aroonTrend === "down") // trailina iki trendIsDown arba aroonTrend down
                    && profitPercent >= 0.2) //trailina kol profitas bus bent 0.2%

                const shouldSell = confirmationSell || isStopLost;

                if (position.entry > 0 && shouldSell) {
                    const sellPrice = price <= position.stop ? position.stop : price;
                    const profit = ((sellPrice - position.entry) / position.entry) * balance;
                    balance += profit;
                    const opResult = 1 //await sellOperation(tradePare);
                    if (opResult > 0) {
                        results.push({
                            action: price <= position.stop ? "STOP_LOSS" : "SELL",
                            date: new Date(currentCandle.timestamp).toLocaleDateString("eu-LT"),
                            time: new Date(currentCandle.timestamp).toLocaleTimeString("eu-LT"),
                            entry: position.entry,
                            price: price,
                            profit: Number(price - position.entry).toFixed(2),
                            profitPercent: ((price - position.entry) / position.entry * 100).toFixed(2) + "%",
                            rsi14: currentAnalysis.rsi14,
                            trend: currentAnalysis.trend,
                            aroonTrend: currentAnalysis.aroonTrend,
                            pattern: currentAnalysis.pattern
                        });
                        position = {
                            entry: 0,
                            stop: 0,
                            target: 0,
                            timestamp: 0
                        };
                    }
                }
            }

            // --- Atnaujinam "praeitą" analizę ir žvakę sekantiems patikrinimams ---
            prevAnalysisRef.current = currentAnalysis;
            prevCandleRef.current = currentCandle;
        }

        let candlesa = [];
        candles.forEach((candle) => {
            candle.date = new Date(candle.timestamp).toLocaleDateString("eu-LT");
            candle.time = new Date(candle.timestamp).toLocaleTimeString("eu-LT");
            candlesa.push(candle);
        })
       // console.table(candlesa.slice(-1));

        console.table(results); // paskutiniai 10 įrašų
        // Pabaiga
        console.log("\n=== BACKTEST REZULTATAI ===");
        console.log(`🔁 Įkelta ${candles.length} žvakių iš DB`);
        console.log("Sandorių:", results.filter(r => r.action !== "BUY").length);
        console.log("Galutinis balansas (SOL):", balance.toFixed(4));
        // console.table(results);

    } catch (error) {
        console.error("❌ Klaida skaitant iš DB:", error);
    }
}
// 🚀 Paleidžiam backtest
runBacktest().then(r => console.log(r));
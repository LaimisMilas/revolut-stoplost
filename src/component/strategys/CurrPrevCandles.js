import {useRef} from "react";

export const twoCandles = {
    "buy" : (prevAnalysis, currentCandle, prevCandle) => {
    if (!prevAnalysis || !currentCandle || !prevCandle) return false;
    return  ["up"].includes(prevAnalysis.aroonTrend) &&
        prevAnalysis.trend === "up" &&
        prevAnalysis.rsi14 < 65 &&
        ["bullish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
        currentCandle.close > prevCandle.close;
},
    "sell" : (prevAnalysis, currentCandle, prevCandle) => {
    if (!prevAnalysis || !currentCandle || !prevCandle) return false;
    return ["down"].includes(prevAnalysis.aroonTrend) &&
        prevAnalysis.trend === "down" &&
        prevAnalysis.rsi14 > 35 &&
        ["bearish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
        currentCandle.close < prevCandle.close;
}}

const run = (prevAnalysisRef, currentCandle, prevCandleRef) =>{
    const prevAnalysis = prevAnalysisRef.current;
    const prevCandle = prevCandleRef.current;
    const confirmationBuy = twoCandles.buy(
        prevAnalysis, currentCandle, prevCandle
    );
}

function evaluateMultiSignals(analysis) {
    const scores = {
        con: analysis.signalCon === "up" ? 3 : 0,
        bal: analysis.signalBal === "up" ? 2 : 0,
        agr: analysis.signalAgr === "up" ? 1 : 0,
    };
    const totalScore = scores.con + scores.bal + scores.agr;
    const shouldBuy = totalScore >= 2; // Arba 3 – priklauso nuo strategijos
    const triggeredBy = Object.keys(scores).find(key => scores[key] > 0);

    return {
        shouldBuy,
        totalScore,
        triggeredBy
    };
}

const runEvaluateMultiSignals = (currentAnalysis) => {
    const multiSignals = evaluateMultiSignals(currentAnalysis);
}

const sd =(price,position,currentAnalysis,prevAnalysis,currentCandle,prevCandle)=> {
    const reachedTakeProfit = price >= position.target;
    const trendIsDown = currentAnalysis.trend === "down";
    const rsiIsHigh = currentAnalysis.rsi14 > 30;
    const bearishPattern = currentAnalysis.pattern === "bearish_engulfing";
    const profitPercent = (price - position.entry) / position.entry * 100;
    const confirmationSell = twoCandles.sell(
        prevAnalysis, currentCandle, prevCandle
    );
    const isStopLost = price <= position.stop;
    const v1 = (reachedTakeProfit // tikslas pasiektas
        && (trendIsDown || currentAnalysis.aroonTrend === "down") // trailina iki trendIsDown arba aroonTrend down
        && profitPercent >= 0.2) //trailina kol profitas bus bent 0.2%
    const shouldSell = confirmationSell || isStopLost;

    // --- Atnaujinam "praeitą" analizę ir žvakę sekantiems patikrinimams ---
    //   prevAnalysisRef.current = currentAnalysis;
    //   prevCandleRef.current = currentCandle;
    const prevAnalysisRef = useRef(null);
    const prevCandleRef = useRef(null);
}

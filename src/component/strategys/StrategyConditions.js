export function shouldBuy({currentAnalysis, previousAnalysis, currentCandle}) {
    const {rsi14, trend, pattern, aroonTrend} = currentAnalysis;

    const rsiCondition = rsi14 < 40;
    const trendCondition = trend === "up";
    const patternCondition = pattern === "bullish_engulfing";
    const aroonCondition = aroonTrend === "up";

    return rsiCondition && trendCondition && patternCondition && aroonCondition;
}

export function shouldSell({price, position, currentAnalysis, currentCandle}) {
    const {rsi14, trend, pattern, aroonTrend} = currentAnalysis;

    const reachedTakeProfit = price >= position.target;
    const trendIsDown = trend === "down";
    const rsiIsHigh = rsi14 > 30;
    const bearishPattern = pattern === "bearish_engulfing";
    const profitPercent = (price - position.entry) / position.entry * 100;

    const takeProfitSell = reachedTakeProfit && trendIsDown && rsiIsHigh && bearishPattern && profitPercent >= 0.2;
    const stopLossSell = price <= position.stop;

    return takeProfitSell || stopLossSell;
}

export const strategyCondition = {
    "buy": (prevAnalysis, currentCandle, prevCandle) => {
        if (!prevAnalysis || !prevCandle) return false;
        return prevAnalysis &&
            prevAnalysis.trend === "up" &&
            ["up", "sideways"].includes(prevAnalysis.aroonTrend) &&
            prevAnalysis.rsi14 < 65 &&
            ["bullish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
            currentCandle.close >= prevCandle.close;
    }, "sell": (prevAnalysis, currentCandle, prevCandle) => {
        if (!prevAnalysis || !prevCandle) return false;
        return prevAnalysis &&
            prevAnalysis.trend === "down" &&
            ["down", "sideways"].includes(prevAnalysis.aroonTrend) &&
            prevAnalysis.rsi14 > 35 &&
            ["bearish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
            currentCandle.close <= prevCandle.close;
    }
};
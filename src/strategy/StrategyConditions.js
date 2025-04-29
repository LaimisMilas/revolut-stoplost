import {isTakeProfReached} from "../component/jobs/sell/PreSellProcess";

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
    }, "sell2": (tradePare, indicatorReadState) => {
        if(isTakeProfReached(tradePare, indicatorReadState) && indicatorReadState.trendDynamic === "down"){
            const correlation = Number(indicatorReadState.parabolicCorrelation);
            return correlation < Number(tradePare.aspectCorrelation);
        }
    }, "shouldBuy": ({currentAnalysis}) => {
        const {rsi14, trend, pattern, aroonTrend} = currentAnalysis;
        const rsiCondition = rsi14 < 40;
        const trendCondition = trend === "up";
        const patternCondition = pattern === "bullish_engulfing";
        const aroonCondition = aroonTrend === "up";
        return rsiCondition && trendCondition && patternCondition && aroonCondition;
    }, "shouldSell": ({price, position, currentAnalysis}) => {
        const {rsi14, trend, pattern} = currentAnalysis;
        const reachedTakeProfit = price >= position.target;
        const trendIsDown = trend === "down";
        const rsiIsHigh = rsi14 > 30;
        const bearishPattern = pattern === "bearish_engulfing";
        const profitPercent = (price - position.entry) / position.entry * 100;
        const takeProfitSell = reachedTakeProfit && trendIsDown && rsiIsHigh && bearishPattern && profitPercent >= 0.2;
        const stopLossSell = price <= position.stop;
        return takeProfitSell || stopLossSell;
    }, "getSignal": (currentAnalysis, signal) => {
        let buySignal = currentAnalysis.signalBal === "up"
        let sellSignal = currentAnalysis.signalBal === "down";
        if(signal === "agrSignal"){
            buySignal = currentAnalysis.signalAgr === "up";
            sellSignal = currentAnalysis.signalAgr === "down";
        } else if(signal === "conSignal"){
            buySignal = currentAnalysis.signalCon === "up";
            sellSignal = currentAnalysis.signalCon === "down";
        }else if(signal === "allSignal"){
            buySignal = currentAnalysis.signalBal === "up" || currentAnalysis.signalAgr === "up" || currentAnalysis.signalCon === "up";
            sellSignal = currentAnalysis.signalBal === "down" || currentAnalysis.signalAgr === "down" || currentAnalysis.signalCon === "down";
        }
        return [buySignal, sellSignal];
    }
};
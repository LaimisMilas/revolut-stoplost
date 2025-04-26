import {buyOperation, sellOperation} from "../utils/RevolutUtils";
import {shouldBuy, shouldSell} from "./StrategyConditions";

/**
 * Strategijos pavadinimas: ReversalStrategy
 * Tikslas: Aprašyti pirkimo ir pardavimo logiką pagal pasirinktus indikatorius.
 */
export const ReversalStrategy = async ({
                                                   candle,
                                                   analysis,
                                                   prevCandle,
                                                   prevAnalysis,
                                                   strategyCondition,
                                                   sellState,
                                                   tradePare
                                               }) => {
    const price = candle.close;

    // --- Pirkimo logika ---
    if (sellState.getPosition() === 0 && strategyCondition.buy(prevAnalysis, analysis, candle, prevCandle)) {
        const opResult = 1; // await buyOperation(tradePare);
        if (opResult > 0) {
            const atr = analysis.atr14 || 0.5;
            sellState.setPosition({
                entry: price,
                stop: price - atr * 1.5,
                target: price + atr * 2.0,
                timestamp: candle.timestamp
            });
            sellState.pushOrder({
                action: "BUY",
                date: new Date(candle.timestamp).toLocaleDateString("eu-LT"),
                time: new Date(candle.timestamp).toLocaleTimeString("eu-LT"),
                price: Number(price).toFixed(2),
                rsi14: analysis.rsi14.toFixed(2),
                trend: analysis.trend,
                aroonTrend: analysis.aroonTrend,
                pattern: analysis.pattern,
            });
        }
    }

    // --- Pardavimo logika ---
    if (sellState.getPosition().entry !== 0 && strategyCondition.sell(prevAnalysis, analysis, candle, prevCandle)) {
        const opResult = 1; // await sellOperation(tradePare);
        if (opResult > 0) {
            const stopLossHit = candle.close <= sellState.getPosition().stop;
            sellState.pushOrder({
                action: stopLossHit ? "STOP_LOSS" : "SELL",
                date: new Date(candle.timestamp).toLocaleDateString("eu-LT"),
                time: new Date(candle.timestamp).toLocaleTimeString("eu-LT"),
                entry: sellState.getPosition().entry,
                price: price,
                profit: Number(price - sellState.getPosition().entry).toFixed(2),
                profitPercent: ((price - sellState.getPosition().entry) / sellState.getPosition().entry * 100).toFixed(2) + "%",
                rsi14: analysis.rsi14,
                trend: analysis.trend,
                aroonTrend: analysis.aroonTrend,
                pattern: analysis.pattern
            });
            sellState.setPosition({
                entry: 0,
                stop: 0,
                target: 0,
                timestamp: 0
            });
        }
    }
};

import {calculateAroonByCandles} from "../../indicator/Aroon";

export const aroonRSIpattern = {
    "cons": (candles, rsi14, pattern) => {
        const period = 25;
        const {aroonUp, aroonDown} = calculateAroonByCandles(candles.slice(-period), period);
        if (
            aroonUp > 70 &&
            aroonDown < 30 &&
            rsi14 < 35 &&
            pattern === "bullish_engulfing"
        ) {
            return "up";
        }
        if (
            aroonDown > 70 &&
            aroonUp < 30 &&
            rsi14 > 65 &&
            pattern === "bearish_engulfing"
        ) {
            return "down";
        }
        return "none"
    },
    "bal": (candles, rsi14, pattern) => {
        const period = 14;
        const {aroonUp, aroonDown} = calculateAroonByCandles(candles.slice(-period), period);

        if (
            aroonUp > 60 &&
            aroonDown < 40 &&
            rsi14 < 40 &&
            pattern === "bullish_engulfing"
        ) {
            return "up";
        }
        if (
            aroonDown > 60 &&
            aroonUp < 40 &&
            rsi14 > 60 &&
            pattern === "bearish_engulfing"
        ) {
            return "down";
        }
        return "none"
    },
    "agr": (candles, rsi14, pattern) => {
        const period = 10;
        const {aroonUp, aroonDown} = calculateAroonByCandles(candles.slice(-period), period);
        if (
            aroonUp > 55 &&
            aroonDown < 45 &&
            rsi14 < 45 &&
            pattern === "bullish_engulfing"
        ) {
            return "up";
        }
        if (
            aroonDown > 55 &&
            aroonUp < 45 &&
            rsi14 > 55 &&
            pattern === "bearish_engulfing"
        ) {
            return "down";
        }
        return "none"
    }
}

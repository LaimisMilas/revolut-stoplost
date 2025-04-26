module.exports = engulfig = {
    "agr": (candles) => {
        if (candles.length < 2) return null;

        const prev = candles[candles.length - 2];
        const curr = candles[candles.length - 1];

        const isBullishEngulfing =
            prev.close < prev.open &&
            curr.close > curr.open &&
        //  curr.open < prev.close &&
            curr.close > prev.open;

        const isBearishEngulfing =
            prev.close > prev.open &&
            curr.close < curr.open // &&
        //  curr.open > prev.close &&
        //  curr.close < prev.open;

        if (isBullishEngulfing) return "bullish_engulfing";
        if (isBearishEngulfing) return "bearish_engulfing";
        return "sideways";
    },
    "bal": (candles) => {
        if (candles.length < 2) return null;

        const prev = candles[candles.length - 2];
        const curr = candles[candles.length - 1];

        const isBullishEngulfing =
            prev.close < prev.open &&
            curr.close > curr.open &&
            // curr.open < prev.close &&
            curr.close > prev.open;

        const isBearishEngulfing =
            prev.close > prev.open &&
            curr.close < curr.open // &&
        //  curr.open > prev.close &&
            curr.close < prev.open;

        if (isBullishEngulfing) return "bullish_engulfing";
        if (isBearishEngulfing) return "bearish_engulfing";
        return "sideways";
    },
    "cons": (candles) => {
        if (candles.length < 2) return null;

        const prev = candles[candles.length - 2];
        const curr = candles[candles.length - 1];

        const isBullishEngulfing =
            prev.close < prev.open &&
            curr.close > curr.open &&
            curr.open < prev.close &&
            curr.close > prev.open;

        const isBearishEngulfing =
            prev.close > prev.open &&
            curr.close < curr.open &&
            curr.open > prev.close &&
            curr.close < prev.open;

        if (isBullishEngulfing) return "bullish_engulfing";
        if (isBearishEngulfing) return "bearish_engulfing";
        return "sideways";
    }
}
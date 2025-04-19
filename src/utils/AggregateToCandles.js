export function aggregateToCandles(data, intervalSeconds = 60) {
    const candles = [];
    let candle = null;
    data.forEach(point => {
        const timestamp = new Date(point.time).getTime();
        const bucket = Math.floor(timestamp / (intervalSeconds * 1000)) * intervalSeconds * 1000;
        if (!candle || candle.timestamp !== bucket) {
            if (candle) candles.push(candle);
            candle = {
                timestamp: bucket,
                open: point.indexPrice,
                high: point.indexPrice,
                low: point.indexPrice,
                close: point.indexPrice
            };
        } else {
            candle.high = Math.max(candle.high, point.indexPrice);
            candle.low = Math.min(candle.low, point.indexPrice);
            candle.close = point.indexPrice;
        }
    });
    if (candle) candles.push(candle);
    return candles;
}
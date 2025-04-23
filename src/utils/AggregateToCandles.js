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

export function aggregateToCandles2(data, intervalSeconds = 60) {
    const grouped = new Map();

    data.forEach(point => {
        const timestamp = new Date(point.time).getTime();
        const bucket = Math.floor(timestamp / (intervalSeconds * 1000)) * intervalSeconds * 1000;

        if (!grouped.has(bucket)) {
            grouped.set(bucket, []);
        }

        grouped.get(bucket).push({
            timestamp,
            price: parseFloat(point.indexPrice)
        });
    });

    const candles = [];

    for (const [bucket, points] of grouped.entries()) {
        const sorted = points.sort((a, b) => a.timestamp - b.timestamp);
        const prices = sorted.map(p => p.price);

        candles.push({
            timestamp: bucket,
            open: prices[0],
            close: prices[prices.length - 1],
            high: Math.max(...prices),
            low: Math.min(...prices)
        });
    }

    // Rikiuojam žvakes pagal laiką
    return candles.sort((a, b) => a.timestamp - b.timestamp);
}
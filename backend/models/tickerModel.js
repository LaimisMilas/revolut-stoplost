const db = require("../db/database");

const insertTicker = (ticker) => {
    const {
        time, pair, bid, ask, mid, indexPrice,
        low24h, high24h, change24h,
        volume24h, marketCap, percentageChange24h, seconds
    } = ticker;

    db.run(
        `INSERT OR REPLACE INTO tickers (
      time, pair, bid, ask, mid, indexPrice,
      low24h, high24h, change24h,
      volume24h, marketCap, percentageChange24h, seconds
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            time, pair, bid, ask, mid, indexPrice,
            low24h, high24h, change24h,
            volume24h, marketCap, percentageChange24h, seconds
        ]
    );
};

const getTickers = (limit = 100) =>
    new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM tickers ORDER BY time DESC LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            }
        );
    });

module.exports = { insertTicker, getTickers };

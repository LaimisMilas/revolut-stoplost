const db = require("../db/database");

const insertCandle = (candle) => {
    candle.date = new Date(candle.timestamp).toLocaleDateString("eu-LT");
    candle.time = new Date(candle.timestamp).toLocaleTimeString("eu-LT");
    const { timestamp, open, high, low, close, date, time } = candle;
    db.run(
        `INSERT OR REPLACE INTO candles (timestamp, open, high, low, close, date, time)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [timestamp, open, high, low, close, date, time]
    );
};

const getCandles = (limit = 100) =>
    new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM candles ORDER BY timestamp DESC LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            }
        );
    });

module.exports = { insertCandle, getCandles };

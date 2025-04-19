// database.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("candles.db");

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS candles (
      timestamp INTEGER PRIMARY KEY,
      open REAL,
      high REAL,
      low REAL,
      close REAL
    )
  `);
});

function insertCandle(candle) {
    const stmt = db.prepare(`
    INSERT OR IGNORE INTO candles (timestamp, open, high, low, close)
    VALUES (?, ?, ?, ?, ?)
  `);

    stmt.run(
        candle.timestamp,
        candle.open,
        candle.high,
        candle.low,
        candle.close
    );

    stmt.finalize();
}

function getLastNCandles(n, callback) {
    db.all(
        `SELECT * FROM candles ORDER BY timestamp DESC LIMIT ?`,
        [n],
        (err, rows) => {
            if (err) {
                console.error("❌ Klaida gaunant žvakes iš DB:", err);
                callback([]);
            } else {
                callback(rows.reverse());
            }
        }
    );
}

function getCandlesInRange(fromTimestamp, toTimestamp, callback) {
    db.all(
        `SELECT * FROM candles WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp ASC`,
        [fromTimestamp, toTimestamp],
        (err, rows) => {
            if (err) {
                console.error("❌ Klaida gaunant žvakes iš DB:", err);
                callback([]);
            } else {
                callback(rows);
            }
        }
    );
}

function getCandlesFromDB(limit = 1000) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM candles ORDER BY timestamp ASC LIMIT ?`;
        db.all(query, [limit], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

module.exports = { insertCandle, getLastNCandles, getCandlesInRange, getCandlesFromDB};

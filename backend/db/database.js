const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../data/candles.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS candles (
       timestamp INTEGER,
       open      REAL,
       high      REAL,
       low       REAL,
       close     REAL,
       date      TEXT,
       time      TEXT,
       id        integer
       constraint candles_pk
       primary key
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS tickers (
        time TEXT PRIMARY KEY,
        pair TEXT,
        bid REAL,
        ask REAL,
        mid REAL,
        indexPrice REAL,
        low24h REAL,
        high24h REAL,
        change24h REAL,
        volume24h REAL,
        marketCap REAL,
        percentageChange24h REAL,
        seconds REAL
  )`);
});

module.exports = db;

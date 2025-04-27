const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../data/candles.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
//  action: "BUY",
//                         date: new Date(currentCandle.timestamp).toLocaleDateString("eu-LT"),
//                         time: new Date(currentCandle.timestamp).toLocaleTimeString("eu-LT"),
//                         price:  Number(price).toFixed(2),
//                         rsi14: currentAnalysis.rsi14.toFixed(2),
//                         emaTrend: currentAnalysis.emaTrend,
//                         aroonTrend: currentAnalysis.aroonTrend,
//                         pattern: currentAnalysis.pattern,
//                         signalCon: currentAnalysis.signalCon,
//                         signalBal: currentAnalysis.signalBal,
//                         signalAgr: currentAnalysis.signalAgr,
//                         isUpLast3: currentAnalysis.isUpLast3,
//                         isDownLast3: currentAnalysis.isDownLast3


    db.run(`CREATE TABLE IF NOT EXISTS orders (
          id integer,
          date TEXT,
          time TEXT,
          price TEXT,
          rsi14 TEXT,
          emaTrend TEXT,
          aroonTrend TEXT,
          pattern TEXT,
          signalCon TEXT,
          signalBal TEXT,
          signalAgr TEXT,
          isUpLast3 TEXT,
          isDownLast3 TEXT
            )`);

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

const db = require("../db/database");

const insertAnalysisLogs = (analysesLogs) => {
    const {
        engulfingType,
        candlesLength,
        rsi14,
        atr14,
        ema10,
        ema20,
        ema50,
        emaTrend,
        pattern,
        aroonTrend,
        aroonCfg,
        signalCon,
        signalBal,
        signalAgr,
        isUpLast3,
        isDownLast3,
        correlateParabolic
    } = analysesLogs;

    const dateTime = new Date();

    db.run(
        `INSERT OR REPLACE INTO analysesLogs (
       engulfingType,
        candlesLength,
        rsi14,
        atr14,
        ema10,
        ema20,
        ema50,
        emaTrend,
        pattern,
        aroonTrend,
        aroonCfg,
        signalCon,
        signalBal,
        signalAgr,
        isUpLast3,
        isDownLast3,
        correlateParabolic,
        dateTime
       )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            engulfingType,
            candlesLength,
            rsi14,
            atr14,
            ema10,
            ema20,
            ema50,
            emaTrend,
            pattern,
            aroonTrend,
            aroonCfg,
            signalCon,
            signalBal,
            signalAgr,
            isUpLast3,
            isDownLast3,
            correlateParabolic,
            dateTime
        ]
    )
};

const getAnalysesLogs = (limit = 100) =>
    new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM analysesLogs ORDER BY id DESC LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            }
        );
    });

module.exports = { insertAnalysisLogs, getAnalysesLogs };

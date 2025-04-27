const db = require("../db/database");

const insertOrder = (order) => {
    const {action, date, time, price, profit, profitPercent, rsi14, emaTrend, aroonTrend, pattern, signalCon, signalBal, signalAgr,
        isUpLast3, isDownLast3} = order;
    db.run(
        `INSERT OR REPLACE INTO orders (action, "date", "time", price, profit, profitPercent, rsi14, emaTrend, aroonTrend, pattern, signalCon, signalBal, signalAgr,
                    isUpLast3, isDownLast3)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [action, date, time, price, profit, profitPercent, rsi14, emaTrend, aroonTrend, pattern, signalCon, signalBal, signalAgr,
            isUpLast3, isDownLast3]
    )
};

const getOrders = (limit = 100) =>
    new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM orders ORDER BY id DESC LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            }
        );
    });

module.exports = { insertOrder, getOrders };

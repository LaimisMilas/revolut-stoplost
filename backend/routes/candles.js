const express = require("express");
const router = express.Router();
const { insertCandle, getCandles } = require("../models/candleModel");

router.post("/", (req, res) => {
    insertCandle(req.body);
    res.sendStatus(200);
});

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const candles = await getCandles(limit);
    res.json(candles);
});

module.exports = router;

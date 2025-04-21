const express = require("express");
const router = express.Router();
const { insertTicker, getTickers } = require("../models/tickerModel");

router.post("/", (req, res) => {
    insertTicker(req.body);
    res.sendStatus(200);
});

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const tickers = await getTickers(limit);
    res.json(tickers);
});

module.exports = router;

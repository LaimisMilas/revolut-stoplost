const express = require("express");
const router = express.Router();
const { insertOrder, getOrders } = require("../models/orderModel");

router.post("/", (req, res) => {
    insertOrder(req.body);
    res.sendStatus(200);
});

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const orders = await getOrders(limit);
    res.json(orders);
});

module.exports = router;

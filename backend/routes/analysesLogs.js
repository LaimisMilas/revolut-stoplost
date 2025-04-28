const express = require("express");
const router = express.Router();
const { insertAnalysisLogs, getAnalysesLogs } = require("../models/analysesLogModel");

router.post("/", (req, res) => {
    insertAnalysisLogs(req.body);
    res.sendStatus(200);
});

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const analysesLogs = await getAnalysesLogs(limit);
    res.json(analysesLogs);
});

module.exports = router;

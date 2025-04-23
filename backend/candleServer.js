const express = require("express");
const cors = require("cors");
const {insertCandle, getLastNCandles, getCandlesInRange} = require("./database");
const fs = require("fs");
const {WebSocketServer} = require("ws");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
// WebSocket serveris
const wss = new WebSocketServer({port: 3003});
const clients = new Set();
let candles = [];

getLastNCandles(60, (latestCandles) => {
    candles.push(...latestCandles);
    console.log("🔁 Užkrautos žvakės iš DB:", candles.length);
});

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("🟢 Naujas WS klientas");

    ws.on("close", () => {
        clients.delete(ws);
        console.log("🔴 Klientas atsijungė");
    });
});

function dataStructureValid(candle) {
    return candle.hasOwnProperty("open")
        && candle.hasOwnProperty("high")
        && candle.hasOwnProperty("low")
        && candle.hasOwnProperty("close")
        && candle.hasOwnProperty("timestamp");
}

function dataValueValid(candle) {
    return candle.open
        && candle.high
        && candle.low
        && candle.close
        && candle.timestamp;
}

app.post("/api/candle", (req, res) => {
    const candle = req.body;
    if (!dataStructureValid(candle) && !dataValueValid(candle)) {
        res.sendStatus(406);
        return;
    }
    try {
        //candles.push(candle);
        candle.date = new Date(candle.timestamp).toLocaleDateString("eu-LT");
        candle.time = new Date(candle.timestamp).toLocaleTimeString("eu-LT");
        //console.log("➕ Nauja žvakė:", candle);
       // fs.writeFileSync(FILE_PATH, JSON.stringify(candles, null, 2));
        insertCandle(candle); // 💾 Įrašom į SQLite
        // Siunčiam naują žvakę visiems prisijungusiems klientams
        for (const client of clients) {
            if (client.readyState === 1) {
                //console.log("➕ Nauja žvakė išsiusta");
                client.send(JSON.stringify(candle));
            }
        }
    } catch (err) {
        console.error("❌ Klaida saugant JSON failą:", err);
    }
    res.sendStatus(200);
});

app.get("/api/candles", (req, res) => {
    const last60 = candles.slice(-60);
    res.json(last60);
});

// Naujas endpointas: gauti žvakes laikotarpiui
app.get("/api/by/range/candles", (req, res) => {
    const from = parseInt(req.query.from); // pvz. 1713312000000
    const to = parseInt(req.query.to);     // pvz. 1713398400000
    if (!from || !to) {
        return res.status(400).json({error: "Trūksta 'from' arba 'to' timestampų"});
    }
    getCandlesInRange(from, to, (candles) => {
        res.json(candles);
    });
});

app.listen(3000, () => {
    console.log("🟢 Candle serveris veikia ant http://localhost:3000");
});

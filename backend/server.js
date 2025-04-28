const express = require("express");
const cors = require("cors");
const app = express();

const candleRoutes = require("./routes/candles");
const tickerRoutes = require("./routes/tickers");
const orderRoutes = require("./routes/orders");
const analysesLogs = require("./routes/analysesLogs");

app.use(cors());
app.use(express.json());

app.use("/api/candles", candleRoutes);
app.use("/api/tickers", tickerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analyses/logs", analysesLogs)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🟢 API serveris veikia http://localhost:${PORT}`);
});
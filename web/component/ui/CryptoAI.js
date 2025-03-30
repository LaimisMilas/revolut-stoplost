import React, { useState, useEffect } from "react";
import ccxt from "ccxt";
import { RSI, MACD } from "technicalindicators";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {inject, observer} from "mobx-react";

const CryptoAI = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

    const [data, setData] = useState([]);
    const [signals, setSignals] = useState("");

    useEffect(() => {
        window.addEventListener("message", async (event) => {
            if (event.source !== window) return;
            if (event.data.type === "EXTENSION_DATA") {
                //await doAction(event.data.data);
                console.log("lak");
            }
        });
        const fetchData = async () => {
            try {
                const exchange = new ccxt.binance();
                const ohlcv = await exchange.fetchOHLCV("BTC/USDT", "5m", undefined, 50);

                const prices = ohlcv.map((candle) => candle[4]); // Uždarymo kainos
                const timestamps = ohlcv.map((candle) => new Date(candle[0]).toLocaleTimeString());

                // RSI skaičiavimas
                const rsiValues = RSI.calculate({ values: prices, period: 14 });

                // MACD skaičiavimas
                const macdValues = MACD.calculate({
                    values: prices,
                    fastPeriod: 12,
                    slowPeriod: 26,
                    signalPeriod: 9,
                    SimpleMAOscillator: false,
                    SimpleMASignal: false,
                });

                const lastRSI = rsiValues[rsiValues.length - 1];
                const lastMACD = macdValues[macdValues.length - 1];

                let signal = "Neutral";
                if (lastRSI < 30 && lastMACD.macd > lastMACD.signal) signal = "BUY 📈";
                if (lastRSI > 70 && lastMACD.macd < lastMACD.signal) signal = "SELL 📉";

                // Atvaizduoti grafikui
                const formattedData = timestamps.map((time, index) => ({
                    time,
                    price: prices[index],
                    rsi: rsiValues[index] || 0,
                }));

                setData(formattedData);
                setSignals(signal);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 10000); // Kas 10 sekundžių atnaujinti duomenis
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="console-box" id="chart-panel" >
            <h2>BTC/USDT Trading Bot</h2>
            <h3>Signal: {signals}</h3>
            <LineChart width={600} height={300} data={data}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
                <Line type="monotone" dataKey="rsi" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
    }));

export default CryptoAI;

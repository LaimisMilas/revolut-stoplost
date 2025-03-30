import React, { useState, useEffect } from "react";
import { RSI, MACD } from "technicalindicators";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {inject, observer} from "mobx-react";

const CryptoAI = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

    const [data, setData] = useState([]);
    const [signals, setSignals] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prices = indicatorReadState.last100PriceValue.slice(indicatorReadState.last100PriceValue.length - 100 ,indicatorReadState.last100PriceValue.length - 1);

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
                const formattedData = prices.map((_, i) => ({
                    i,
                    price: prices[i],
                    rsi: rsiValues[i-14] || 0,
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
        <div>
            <h2>BTC/USDT Trading Bot</h2>
            <h3>Signal: {signals}</h3>
            <LineChart width={600} height={300} data={data}>
                <XAxis dataKey="i" />
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

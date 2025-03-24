import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
// Registruojame būtinas Chart.js komponentes
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import Draggable from "react-draggable";
import {calculateEMA, calculateMACD} from "../../indicator/MACD";
import {downsampleArray, movingAverage, simpleMovingAverage} from "../../utils/dataFilter";

const ParabolicChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const arrayIndex = 50;

            const calcEMA12 = () => {
                const period = 12;
                // const from = indicatorReadState.last100PriceValue.length -1 - 120;
                let data = indicatorReadState.tickerValue.map(item => parseFloat(item.indexPrice));
                const from = data.length - 300;
                const to = data.length - 1;
                data = downsampleArray(data.slice(from, to), 10);
                return calculateEMA(data, period);
            }
            const calcEMA26 = () => {
                const period = 26;
                // const from = indicatorReadState.last100PriceValue.length -1 - 120;
                let data = indicatorReadState.tickerValue.map(item => parseFloat(item.indexPrice));
                const from = data.length - 300;
                const to = data.length - 1;
                data = downsampleArray(data.slice(from, to), 10);
                return calculateEMA(data, period);
            }

            const [ema12Value, setEMA12] = useState([]);
            const [ema26Value, setEMA26] = useState([]);

            const doParabolicCorrelation = () => {
                const n = 50;
                if (n < 3) {
                    console.error("RSI reikšmių per mažai, reikia bent 3.");
                    return 0;
                }

                // Generuojame X reikšmes: simetriškai aplink nulį
                const xValues = Array.from({ length: n }, (_, i) => i - Math.floor(n / 2));

                // Parabolės funkcija: y = a*x^2 + c
                const a = 0.5; // Reguliuojamas kreivumo koeficientas
                const c = 1;   // Vertikalus poslinkis

                return xValues.map(x => a * x ** 2 + c);
            };

            const getChartData = () => {
                return {
                    labels: ema12Value.map((_, i) => i + 1),
                        datasets: [
                    {
                        label: "Ema12",
                        data: ema12Value,
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        pointRadius: 2,
                        tension: 0.4
                    },
                        {
                            label: "Ema26",
                            data: ema26Value,
                            borderColor: "rgb(163,75,192)",
                            backgroundColor: "rgba(132,75,192,0.2)",
                            pointRadius: 2,
                            tension: 0.4
                        }
                ],
                }
            };

            const [chartData, setChartData] = useState(getChartData());

            const [options, setOptions] = useState({
                responsive: true,
                scales: {
                    x: {title: {display: true, text: "Masyvo indeksas"}},
                    y: {title: {display: true, text: "RSI"}},
                },
            });

            useEffect(() => {
                setEMA12(calcEMA12());
                setEMA26(calcEMA26());
                setChartData(getChartData());

          }, [indicatorReadState.last100RSICounter]);

            return (
                <Draggable>
                <div className="console-box" id="parabolic-chart-panel">
                    <div className="checkbox-row">
                        <Line data={chartData} options={options}/>
                    </div>
                </div>
                    </Draggable>
            );
        }));

export default ParabolicChartPanel;

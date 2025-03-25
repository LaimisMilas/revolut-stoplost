import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import {Line, Bar} from "react-chartjs-2";
import {
    BarElement,
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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);
import Draggable from "react-draggable";
import {calculateEMA} from "../../indicator/MACD";

const ParabolicChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const calcEma = () => {
                let data = indicatorReadState.getLastTickers(indicatorReadState.tickerValue.length, 218);
                setEMA12(calculateEMA(data, 12));
                setEMA26(calculateEMA(data, 26));
            }

            const calcSignalLine = () => {
                let data = indicatorReadState.getLastTickers(indicatorReadState.tickerValue.length, 109);
                const ema12 = calculateEMA(data, 12);
                const ema26 = calculateEMA(data, 26);
                if (ema12.length === 0 || ema26.length === 0) {
                    return;
                }
                const ema12Trimmed = ema12.slice(ema12.length - ema26.length);
                const macdLine = ema12Trimmed.map((ema, i) => ema - ema26[i]);
                return calculateEMA(macdLine, 9);
            }

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [ema12Value, setEMA12] = useState([]);
            const [ema26Value, setEMA26] = useState([]);
            const [signalLine, setSignalLine] = useState([]);

            const doParabolicCorrelation = () => {
                const n = 50;
                if (n < 3) {
                    console.error("RSI reikšmių per mažai, reikia bent 3.");
                    return 0;
                }

                // Generuojame X reikšmes: simetriškai aplink nulį
                const xValues = Array.from({length: n}, (_, i) => i - Math.floor(n / 2));

                // Parabolės funkcija: y = a*x^2 + c
                const a = 0.5; // Reguliuojamas kreivumo koeficientas
                const c = 1;   // Vertikalus poslinkis

                return xValues.map(x => a * x ** 2 + c);
            };

            const getChartData = () => {
                return {
                    labels: ema26Value.map((_, i) => i + 1),
                    datasets: [
                        {
                            label: "Ema12",
                            data: ema12Value,
                            borderColor: "rgba(75,192,192,1)",
                            backgroundColor: "rgba(75,192,192,0.2)",
                            borderWidth: 1,
                            pointRadius: 2,
                            tension: 0.4
                        },
                        {
                            label: "Ema26",
                            data: ema26Value,
                            borderWidth: 1,
                            borderColor: "rgb(163,75,192)",
                            backgroundColor: "rgba(132,75,192,0.2)",
                            pointRadius: 2,
                            tension: 0.4
                        }
                    ]
                }
            };

            const getChartData2 = () => {
                return {
                    labels: signalLine.map((_, i) => i + 1),
                    datasets: [
                        {
                            label: "Signal",
                            data: signalLine,
                            borderColor: "rgba(75,192,192,1)",
                            backgroundColor: "rgba(75,192,192,0.2)",
                            pointRadius: 2,
                            tension: 0.4
                        }
                    ]
                }
            };

            const [chartData, setChartData] = useState(getChartData());

            const [chartData2, setChartData2] = useState(getChartData2());

            const [options, setOptions] = useState({
                responsive: true,
                scales: {
                    x: {title: {display: true, text: "Masyvo indeksas"}},
                    y: {title: {display: true, text: "RSI"}},
                },
            });

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            useEffect(() => {
                calcEma();
                setChartData(getChartData());
                setSignalLine(calcSignalLine());
                setChartData2(getChartData2());

            }, [indicatorReadState.last100RSICounter]);

            return (
                <Draggable>
                    <div className="console-box" id="parabolic-chart-panel">
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="checkbox-row">
                                <Line data={chartData} options={options}/>
                            </div>
                            <div className="checkbox-row">
                                <Bar data={chartData2} options={{
                                    responsive: true,
                                    scales: {
                                        x: {title: {display: true, text: "Masyvo indeksas"}},
                                        y: {title: {display: true, text: "RSI"}},
                                    },
                                }}/>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default ParabolicChartPanel;

import {inject, observer} from 'mobx-react';
import React, {useState} from 'react';
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

const ParabolicChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const arrayIndex = 50;

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
                    labels: doParabolicCorrelation().map((_, i) => i + 1),
                        datasets: [
                    {
                        label: "Parabole",
                        data: doParabolicCorrelation(),
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        pointRadius: 3,
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

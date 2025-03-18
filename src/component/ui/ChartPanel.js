import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import {doParabolicCorrelation, simpleMovingAverage} from "../../utils/IndicatorsUtils";
import Draggable from 'react-draggable';
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
// Registruojame būtinas Chart.js komponentes
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const arrayIndex = 50;
            const getParabolicValues = (data) => {
                const xValues = [...Array(data.length).keys()]; // sudes vertes nuo 0 -> 50
                return xValues.map(x => 0.5 * x ** 2 - 4 * x + 30); // a=0.5, b=-4, c=30
                // y = ax2 + bx + c
                // Kai a > 0 → Parabolė atsiveria į viršų (🔼)
                // Kai a < 0 → Parabolė atsiveria žemyn (🔽)
                // b → Valdo pasvirimą (į dešinę ar į kairę)
                // c → Nustato pradinę vertę (poslinkį aukštyn arba žemyn)
            }
            const getRSIData = () => {
                let data = indicatorReadState.last100RSIValue.slice(arrayIndex, indicatorReadState.last100RSIValue.length);
                return simpleMovingAverage(data, 20);
            }
            const [rsiData, setRsiData] = useState(getRSIData);
            const getCartData = () => {
                return {
                    labels: rsiData.map((_, i) => i + 1),
                        datasets: [
                    {
                        label: "RSI kreivė",
                        data: rsiData,
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        pointRadius: 3,
                        tension: 0.4
                    }
                ],
                }
            };
            const [chartData, setChartData] = useState(getCartData());
            const [options, setOptions] = useState({
                responsive: true,
                scales: {
                    x: {title: {display: true, text: "Masyvo indeksas"}},
                    y: {title: {display: true, text: "RSI"}},
                },
            });
            const [correlationIndex, setCorrelationIndex] = useState(doParabolicCorrelation(rsiData, "Chart RSI"));

            useEffect(() => {
                setRsiData(getRSIData());
                setChartData(getCartData());
                setCorrelationIndex(doParabolicCorrelation(rsiData, "Chart RSI"));

            }, [indicatorReadState.last100RSICounter]);

            return (
                <div className="console-box" id="chart-panel">
                    <div className="checkbox-row">
                        <Line data={chartData} options={options}/>
                    </div>
                    <div className="checkbox-row">
                        <div className="checkbox-row">
                            <label>Correlation index</label>
                            <span>{correlationIndex}</span>
                        </div>
                    </div>
                </div>
            );
        }));

export default ChartPanel;

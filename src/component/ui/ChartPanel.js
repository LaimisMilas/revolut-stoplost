import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
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
import {cleanData} from "../../utils/dataFilter";
import Draggable from "react-draggable";
import {doParabolicCorrelation} from "../../indicator/Correletion";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const arrayIndex = 0;

            const getRSIData = () => {
                let data = indicatorReadState.last100RSIValue.slice(arrayIndex, indicatorReadState.last100RSIValue.length);
                return cleanData(data);
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
                <Draggable>
                    <div className="console-box" id="chart-panel">
                        <div className="checkbox-row">
                            <Line data={chartData} options={options}/>
                        </div>
                        <div className="checkbox-row">
                            <label>Correlation index</label>
                            <span>{correlationIndex}</span>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default ChartPanel;

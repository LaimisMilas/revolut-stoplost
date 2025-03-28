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
import Draggable from "react-draggable";
import {generateSineWaveData} from "../../utils/wave";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const getCartData = (data) => {
                return {
                    labels: data.map((_, i) => i),
                        datasets: [
                    {
                        label: "RSI kreivė",
                        data: data,
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        pointRadius: 3,
                        tension: 0.4
                    }
                ],
                }
            };

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(true);
            const [chartData, setChartData] = useState(getCartData(indicatorReadState.last100RSIValue));

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            useEffect(() => {
                setChartData(getCartData(indicatorReadState.last100RSIValue));
                indicatorReadState.calcParabolicCorrelation();
                indicatorReadState.calculateDivergence();
                indicatorReadState.calcSinusoidCorrelation();
            }, [indicatorReadState.last100RSICounter]);

            return (
                <Draggable>
                    <div className="console-box" id="chart-panel">
                         <span className="activeTime">
                           <span
                               className="panelTitle">Chart panel</span>
                        </span>
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="checkbox-row">
                                <Line data={chartData} options={{
                                    responsive: true,
                                    scales: {
                                        x: {title: {display: true, text: "Masyvo indeksas"}},
                                        y: {title: {display: true, text: "RSI"}},
                                    },
                                }}/>
                            </div>
                            <div className="checkbox-row">
                                <label>Parabolic correlation</label>
                                <span>{indicatorReadState.parabolicCorrelation}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>Sinusoid correlation</label>
                                <span>{indicatorReadState.sinusoidCorrelation}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>RSI14</label>
                                <span>{indicatorReadState.lastRSIValue}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>Divergence</label>
                                <span>{indicatorReadState.divergence}</span>
                            </div>
                            <div className="checkbox-row">
                                <Line data={{
                                    labels: indicatorReadState.last100RSIValue.map((_, i) => i),
                                    datasets: [
                                        {
                                            label: "Sinusoid kreivė",
                                            data: generateSineWaveData(indicatorReadState.last100RSIValue.length - 1, 10),
                                            borderColor: "rgba(75,192,192,1)",
                                            backgroundColor: "rgba(75,192,192,0.2)",
                                            pointRadius: 3,
                                            tension: 0.4
                                        }
                                    ],
                                }} options={{
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

export default ChartPanel;

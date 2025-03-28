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
import {cleanData, downsampleArray} from "../../utils/dataFilter";
import Draggable from "react-draggable";
import {doParabolicCorrelation, doSinusoidCorrelation} from "../../indicator/Correletion";
import {calculateRSI} from "../../indicator/RSI14";
import {checkDivergence} from "../../utils/IndicatorsUtils";
import {generateSineWaveData} from "../../utils/wave";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPanel =
    inject("indicatorReadState")(
        observer(({indicatorReadState}) => {

            const arrayIndex = 0;

            const getRSIData = () => {
                let data = indicatorReadState.last100RSIValue.slice(arrayIndex, indicatorReadState.last100RSIValue.length);
                return downsampleArray(data, 30);
            }
            const getRSIData2 = () => {
                return indicatorReadState.last100RSIValue;
            }

           // const [rsiData, setRsiData] = useState(getRSIData);
            const [rsiData2, setRsiData2] = useState(getRSIData2);

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
            //const [chartData, setChartData] = useState(getCartData(rsiData));
            const [chartData2, setChartData2] = useState(getCartData(rsiData2));
           // const [correlationIndex, setCorrelationIndex] = useState(doParabolicCorrelation(rsiData, "Chart RSI"));
            const [correlation2Index, setCorrelation2Index] = useState(doParabolicCorrelation(rsiData2, "Chart RSI"));
            const [sinusoidCorrelationIndex, setSinusoidCorrelationIndex] = useState(doSinusoidCorrelation(rsiData2));
            const [lastRsiValue, setLastRsiValue] = useState(indicatorReadState.lastRSIValue);
            const [divergence, setDivergence] = useState(checkDivergence(indicatorReadState.last100PriceValue,rsiData2));

            useEffect(() => {
               // setRsiData(getRSIData());
                setRsiData2(getRSIData2());
                //setChartData(getCartData(rsiData));
                setChartData2(getCartData(rsiData2));
                //setCorrelationIndex(doParabolicCorrelation(rsiData, "Chart RSI"));
                setCorrelation2Index(doParabolicCorrelation(rsiData2, "Chart RSI"));
                setLastRsiValue(indicatorReadState.lastRSIValue);
                setDivergence(checkDivergence(indicatorReadState.last100PriceValue,rsiData2));
                setSinusoidCorrelationIndex(doSinusoidCorrelation(rsiData2))
            }, [indicatorReadState.last100RSICounter]);

            return (
                <Draggable>
                    <div className="console-box" id="chart-panel">
                        <div className="checkbox-row">
                            <Line data={chartData2} options={{
                                responsive: true,
                                scales: {
                                    x: {title: {display: true, text: "Masyvo indeksas"}},
                                    y: {title: {display: true, text: "RSI"}},
                                },
                            }}/>
                        </div>
                        <div className="checkbox-row">
                            <label>Parabolic correlation</label>
                            <span>{correlation2Index}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Sinusoid correlation</label>
                            <span>{sinusoidCorrelationIndex}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>RSI14</label>
                            <span>{lastRsiValue}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Divergence</label>
                            <span>{divergence}</span>
                        </div>
                        <div className="checkbox-row">
                            <Line data={{
                                labels: rsiData2.map((_, i) => i),
                                datasets: [
                                    {
                                        label: "Sinusoid kreivė",
                                        data: generateSineWaveData(rsiData2.length - 1, 10),
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
                </Draggable>
            );
        }));

export default ChartPanel;

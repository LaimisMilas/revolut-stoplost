import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";
const IndicatorsPanel =
    inject("buyState", "sellState", "buyPanelState", "indicatorReadState")(
        observer(({buyState, sellState, buyPanelState, indicatorReadState}) => {

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            return (
                <Draggable>
                    <div className="console-box" id="indicators-panel" hidden={buyPanelState.stopAllAction}>
                        <div className="tab-container">
                        <span className="activeTime">
                           <span
                               className="panelTitle">Indicator's</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                            <button className="exit-button"
                                    onClick={() => handleCollapseButtonClick()}>
                                {checkBoxContainerState === true ? "▼" : "▲"}
                            </button>
                            <div hidden={checkBoxContainerState}>
                                <div className="checkbox-row">
                                    <label>Trend dynamic</label>
                                    <span>{indicatorReadState.trendDynamic}</span>
                                    <span>&nbsp; ch:{indicatorReadState.dynamicTrendChunkSize}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Try counter</label>
                                    <span>sell:{sellState.countTrySell}</span>
                                    <span>&nbsp; buy:{buyState.countTryBuy}</span>
                                </div>
                                <div className="checkbox-row">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Minutes</th>
                                            <th>5</th>
                                            <th>15</th>
                                            <th>30</th>
                                            <th>45</th>
                                            <th>60</th>
                                            <th>165</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Prb. RSI</td>
                                            <td>{indicatorReadState.getRSIParabolicCorrelation(300, 10)}</td>
                                            <td>{indicatorReadState.getRSIParabolicCorrelation(900, 30)}</td>
                                            <td>{indicatorReadState.getRSIParabolicCorrelation(1842, 90)}</td>
                                            <td>{indicatorReadState.getRSIParabolicCorrelation(2700, 90)}</td>
                                            <td>{indicatorReadState.getRSIParabolicCorrelation(3600, 120)}</td>
                                            <td>{indicatorReadState.getRSIParabolicCorrelation(11249, 375)}</td>
                                        </tr>
                                        <tr>
                                            <td>Prb. Prc</td>
                                            <td>{indicatorReadState.getParabolicCorrelation(300, 10)}</td>
                                            <td>{indicatorReadState.getParabolicCorrelation(900, 30)}</td>
                                            <td>{indicatorReadState.getParabolicCorrelation(1800, 60)}</td>
                                            <td>{indicatorReadState.getParabolicCorrelation(2700, 90)}</td>
                                            <td>{indicatorReadState.getParabolicCorrelation(3600, 120)}</td>
                                            <td>{indicatorReadState.getParabolicCorrelation(11249, 375)}</td>
                                        </tr>
                                        <tr>
                                            <td>Trend</td>
                                            <td>{indicatorReadState.calculateTrend(300, 10)}</td>
                                            <td>{indicatorReadState.calculateTrend(900, 30)}</td>
                                            <td>{indicatorReadState.calculateTrend(1800, 60)}</td>
                                            <td>{indicatorReadState.calculateTrend(2700, 90)}</td>
                                            <td>{indicatorReadState.calculateTrend(3600, 120)}</td>
                                            <td>{indicatorReadState.calculateTrend(11249, 375)}</td>
                                        </tr>
                                        <tr>
                                            <td>Last RSI</td>
                                            <td>{indicatorReadState.rsiTable[0]}</td>
                                            <td>{indicatorReadState.rsiTable[1]}</td>
                                            <td>{indicatorReadState.rsiTable[2]}</td>
                                            <td>{indicatorReadState.rsiTable[3]}</td>
                                            <td>{indicatorReadState.rsiTable[4]}</td>
                                            <td>{indicatorReadState.rsiTable[5]}</td>
                                        </tr>
                                        <tr>
                                            <td>Trailing RSI</td>
                                            <td>{indicatorReadState.trailingBuyBots[0].buySignal ? "true" : "false"}</td>
                                            <td>{indicatorReadState.trailingBuyBots[1].buySignal ? "true" : "false"}</td>
                                            <td>{indicatorReadState.trailingBuyBots[2].buySignal ? "true" : "false"}</td>
                                            <td>{indicatorReadState.trailingBuyBots[3].buySignal ? "true" : "false"}</td>
                                            <td>{indicatorReadState.trailingBuyBots[4].buySignal ? "true" : "false"}</td>
                                            <td>{indicatorReadState.trailingBuyBots[5].buySignal ? "true" : "false"}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="checkbox-row">
                                    <label>TickerIndex</label>
                                    <span>{indicatorReadState.tickerIndex}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default IndicatorsPanel;

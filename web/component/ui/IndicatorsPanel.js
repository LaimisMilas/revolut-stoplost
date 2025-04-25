import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";
const IndicatorsPanel =
    inject("buyState", "sellState", "buyPanelState", "indicatorState")(
        observer(({buyState, sellState, buyPanelState, indicatorState}) => {

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
                                    <span>{indicatorState.trendDynamic}</span>
                                    <span>&nbsp; ch:{indicatorState.dynamicTrendChunkSize}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Parabolic Correl.</label>
                                    <span>{indicatorState.parabolicCorrelation}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>RSI 14</label>
                                    <span>{indicatorState.rsi14}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>CA RSI 14</label>
                                    <span>{Number(indicatorState.candleAnalyze.rsi14).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>TickerIndex</label>
                                    <span>{indicatorState.indicatorCounter}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default IndicatorsPanel;

import React from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";
const CandleAnalyzerPanel =
    inject("buyPanelState", "indicatorReadState")(
        observer(({ buyPanelState, indicatorReadState}) => {

            return (
                <Draggable>
                    <div className="console-box" id="indicators-panel">
                        <div className="tab-container">
                        <span className="activeTime">
                           <span
                               className="panelTitle">Candle analyzer</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                            <div className="checkbox-row">
                                <label>ema20</label>
                                <span>{Number(indicatorReadState.candleAnalyze.ema20).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>ema50</label>
                                <span>{Number(indicatorReadState.candleAnalyze.ema50).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>rsi14</label>
                                <span>{Number(indicatorReadState.candleAnalyze.rsi14).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>atr14</label>
                                <span>{Number(indicatorReadState.candleAnalyze.atr14).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>trend</label>
                                <span>{indicatorReadState.candleAnalyze.trend}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>pattern</label>
                                <span>{indicatorReadState.candleAnalyze.pattern}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>TickerIndex</label>
                                <span>{indicatorReadState.tickerIndex}</span>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default CandleAnalyzerPanel;

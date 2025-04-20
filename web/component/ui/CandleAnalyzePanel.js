import React from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";
const CandleAnalyzerPanel =
    inject("indicatorState")(
        observer(({indicatorState}) => {
            return (
                <Draggable>
                    <div className="console-box" id="indicators-panel">
                        <div className="tab-container">
                             <span className="activeTime">
                           <span
                               className="panelTitle">Candle analyze</span>
                        </span>
                            <div className="checkbox-row">
                                <label>EMA20</label>
                                <span>{Number(indicatorState.candleAnalyze.ema20).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>EMA50</label>
                                <span>{Number(indicatorState.candleAnalyze.ema50).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>RSI14</label>
                                <span>{Number(indicatorState.candleAnalyze.rsi14).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>ATR14</label>
                                <span>{Number(indicatorState.candleAnalyze.atr14).toFixed(2)}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>Trend</label>
                                <span>{indicatorState.candleAnalyze.trend}</span>
                            </div>
                            <div className="checkbox-row">
                                <label>Pattern</label>
                                <span>{indicatorState.candleAnalyze.pattern}</span>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default CandleAnalyzerPanel;

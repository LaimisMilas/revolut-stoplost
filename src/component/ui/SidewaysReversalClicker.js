import {inject, observer} from "mobx-react";
import React, {useEffect, useRef, useState} from "react";
import './css/CfgPanel.css';
import Draggable from "react-draggable";
import { ReversalStrategy } from "../strategys/ReversalStrategy";
import {strategyCondition} from "../strategys/StrategyConditions";

const SidewaysReversalClicker = inject("sellState", "candleService", "indicatorState")(
    observer(({sellState, candleService, indicatorState}) => {

        const parsePareFromURL = () => {
            let tmp = window.location.href.split("/trade/");
            if(window.location.href.includes("/trade/")){
                return tmp[1].split("-")[0];
            }
            return "SOL";
        }

        const [tradePare, setTradePare] = useState(sellState.getTradePareDataByKey(parsePareFromURL()));
        const [analysis, setAnalysis] = useState(indicatorState.candleAnalyze);
        const prevAnalysisRef = useRef(null);
        const prevCandleRef = useRef(null);

        useEffect(() => {

            const execute = async () => {
                const currentCandle = candleService.getCurrentCandle();
                const currentAnalysis = indicatorState.candleAnalyze;

                setAnalysis(currentAnalysis);

                await ReversalStrategy({
                    candle: currentCandle,
                    analysis: currentAnalysis,
                    prevCandle: prevCandleRef.current,
                    prevAnalysis: prevAnalysisRef.current,
                    strategyCondition: strategyCondition,
                    sellState,
                    tradePare
                });

                // --- Atnaujinam "praeitą" analizę ir žvakę sekantiems patikrinimams ---
                prevAnalysisRef.current = currentAnalysis;
                prevCandleRef.current = currentCandle;
            };
            execute().then();
        }, [indicatorState.indicatorCounter]);

        return (
            <Draggable>
                <div className="console-box" id="trade-comp-panel">
                    <div className="tab-container">
                             <span className="activeTime">
                           <span
                               className="panelTitle">Trade component</span>
                        </span>
                        <div className="checkbox-row">
                            <label>EMA10</label>
                            <span>{Number(analysis.ema10).toFixed(2)}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>EMA20</label>
                            <span>{Number(analysis.ema20).toFixed(2)}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>EMA50</label>
                            <span>{Number(analysis.ema50).toFixed(2)}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>RSI14</label>
                            <span>{Number(analysis.rsi14).toFixed(2)}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>ATR14</label>
                            <span>{Number(analysis.atr14).toFixed(2)}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Trend</label>
                            <span>{analysis.trend}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>AroonTrend</label>
                            <span>{analysis.aroonTrend}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Pattern</label>
                            <span>{analysis.pattern}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Entry</label>
                            <span>{sellState.getPosition().entry}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Stop-lost</label>
                            <span>{sellState.getPosition().stop}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Target</label>
                            <span>{sellState.getPosition().target}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Timestamp</label>
                            <span>{sellState.getPosition().timestamp}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Orders</label>
                            <span>{sellState.orders.length}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Profit</label>
                            <span>{Number(sellState.orders.map(o => o.profit ? (o.profit - o.price) : 0).reduce((a, c) => {
                                return a + c
                            })).toFixed(4)}</span>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }));

export default SidewaysReversalClicker;


import {inject, observer} from "mobx-react";
import React, {useEffect, useRef, useState} from "react";
import './css/CfgPanel.css';
import Draggable from "react-draggable";

const TradeClicker = inject("sellState", "candleService", "indicatorState")(
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

        const isConfirmationBuy = (prevAnalysis, currentCandle, prevCandle) => {
            if (!prevAnalysis || !currentCandle || !prevCandle) return false;
            return  ["up"].includes(prevAnalysis.aroonTrend) &&
                prevAnalysis.trend === "up" &&
                prevAnalysis.rsi14 < 65 &&
                ["bullish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
                currentCandle.close > prevCandle.close;
        };

        const isConfirmationSell = (prevAnalysis, currentCandle, prevCandle) => {
            if (!prevAnalysis || !currentCandle || !prevCandle) return false;
            return ["down"].includes(prevAnalysis.aroonTrend) &&
                prevAnalysis.trend === "down" &&
                prevAnalysis.rsi14 > 35 &&
                ["bearish_engulfing", "sideways"].includes(prevAnalysis.pattern) &&
                currentCandle.close < prevCandle.close;
        };

        useEffect(() => {

            const execute = async () => {
                await doTrade();
            };
            execute().then();
        }, [indicatorState.indicatorCounter]);

        const doTrade = async () => {
            const currentCandle = candleService.getCurrentCandle();
            const currentAnalysis = indicatorState.candleAnalyze;
            setAnalysis(currentAnalysis);

            const price = currentCandle.close;
            const position = sellState.getPosition();

            const prevAnalysis = prevAnalysisRef.current;
            const prevCandle = prevCandleRef.current;

            const confirmationBuy = isConfirmationBuy(
                prevAnalysis, currentCandle, prevCandle
            );

            if (position.entry === 0 && confirmationBuy) {
                const opResult = 1 //await buyOperation(tradePare);
                if(opResult > 0){
                    const atr = currentAnalysis.atr14 || 0.5;
                    sellState.setPosition({
                        entry: price,
                        stop: price - atr * 1.5,
                        target: price + atr * 2.0,
                        timestamp: currentCandle.timestamp
                    });
                    sellState.pushOrder({
                        action: "BUY",
                        date: new Date(currentCandle.timestamp).toLocaleDateString("eu-LT"),
                        time: new Date(currentCandle.timestamp).toLocaleTimeString("eu-LT"),
                        price:  Number(price).toFixed(2),
                        rsi14: currentAnalysis.rsi14.toFixed(2),
                        trend: currentAnalysis.trend,
                        aroonTrend: currentAnalysis.aroonTrend,
                        pattern: currentAnalysis.pattern,
                        signalCon: currentAnalysis.signalCon,
                        signalBal: currentAnalysis.signalBal,
                        signalAgr: currentAnalysis.signalAgr,
                        isUpLast3: currentAnalysis.isUpLast3,
                        isDownLast3: currentAnalysis.isDownLast3
                    });
                }
            } else if (position.entry !== 0) {
                const reachedTakeProfit = price >= position.target;
                const trendIsDown = currentAnalysis.trend === "down";
                const rsiIsHigh = currentAnalysis.rsi14 > 30;
                const bearishPattern = currentAnalysis.pattern === "bearish_engulfing";
                const profitPercent = (price - position.entry) / position.entry * 100;
                const confirmationSell = isConfirmationSell(
                    prevAnalysis, currentCandle, prevCandle
                );
                const isStopLost = price <= position.stop;
                const v1 = (reachedTakeProfit // tikslas pasiektas
                    && (trendIsDown || currentAnalysis.aroonTrend === "down") // trailina iki trendIsDown arba aroonTrend down
                    && profitPercent >= 0.2) //trailina kol profitas bus bent 0.2%

                const shouldSell = confirmationSell || isStopLost;

                if (position.entry > 0 && shouldSell) {
                    const opResult = 1 //await sellOperation(tradePare);
                    if(opResult > 0) {
                        sellState.pushOrder({
                            action: price <= position.stop ? "STOP_LOSS" : "SELL",
                            date: new Date(currentCandle.timestamp).toLocaleDateString("eu-LT"),
                            time: new Date(currentCandle.timestamp).toLocaleTimeString("eu-LT"),
                            entry: position.entry,
                            price: price,
                            profit: Number(price - position.entry).toFixed(2),
                            profitPercent: ((price - position.entry) / position.entry * 100).toFixed(2) + "%",
                            rsi14: currentAnalysis.rsi14,
                            trend: currentAnalysis.trend,
                            aroonTrend: currentAnalysis.aroonTrend,
                            pattern: currentAnalysis.pattern,
                            signalCon: currentAnalysis.signalCon,
                            signalBal: currentAnalysis.signalBal,
                            signalAgr: currentAnalysis.signalAgr,
                            isUpLast3: currentAnalysis.isUpLast3,
                            isDownLast3: currentAnalysis.isDownLast3
                        });
                        sellState.setPosition({
                            entry: 0,
                            stop: 0,
                            target: 0,
                            timestamp: 0
                        });
                    }
                }
            }

            // --- Atnaujinam "praeitą" analizę ir žvakę sekantiems patikrinimams ---
            prevAnalysisRef.current = currentAnalysis;
            prevCandleRef.current = currentCandle;
        };

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
                            <label>signalCon</label>
                            <span>{analysis.signalCon}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>signalBal</label>
                            <span>{analysis.signalBal}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>signalAgr</label>
                            <span>{analysis.signalAgr}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>isUpLast3</label>
                            <span>{analysis.isUpLast3 ? "true": "false"}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>isDownLast3</label>
                            <span>{analysis.isDownLast3 ? "true": "false"}</span>
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
                            <span>{Number(sellState.orders.map(o => o.profit ? (o.price - o.entry) : 0).reduce((a, c) => {
                                return a + c
                            })).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }));

export default TradeClicker;


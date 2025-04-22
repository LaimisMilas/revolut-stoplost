import {inject, observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import './css/CfgPanel.css';
import Draggable from "react-draggable";
import {buyOperation, sellOperation} from "../../utils/RevolutUtils";

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
        const [candle, setCandle] = useState(candleService.candle);
        const [localPosition, setLocalPosition] = useState(sellState.getPosition());

        useEffect(() => {

            const execute = async () => {
                await doTrade();
            };
            execute().then();
        }, [indicatorState.indicatorCounter]);

        const doTrade = async () => {
            setCandle(candleService.getCurrentCandle());
            setAnalysis(indicatorState.candleAnalyze);
            const price = candle.close;
            setLocalPosition(sellState.getPosition());

            if (localPosition.entry === 0) {
                const shouldBuy =
                    analysis.trend === "up" &&
                    analysis.rsi14 < 70 &&
                    analysis.pattern === "bullish_engulfing";

                if (shouldBuy) {
                    const opResult = 1 //await buyOperation(tradePare);
                    if(opResult > 0){
                        const atr = analysis.atr14 || 0.5;
                        sellState.setPosition({
                            entry: price,
                            stop: price - atr * 1.5,
                            target: price + atr * 2.5,
                            timestamp: candle.timestamp
                        });
                        sellState.pushOrder({
                            action: "BUY",
                            date: new Date(candle.timestamp).toLocaleDateString("eu-LT"),
                            time: new Date(candle.timestamp).toLocaleTimeString("eu-LT"),
                            price:  Number(price).toFixed(2),
                            rsi14: analysis.rsi14.toFixed(2),
                            trend: analysis.trend,
                            pattern: analysis.pattern,
                        });
                    }
                }
            } else {
                const reachedTakeProfit = price >= localPosition.target;
                const trendIsDown = analysis.trend === "down";
                const rsiIsHigh = analysis.rsi14 > 30;
                const bearishPattern = analysis.pattern === "bearish_engulfing";

                const shouldSell =
                    (reachedTakeProfit && trendIsDown && rsiIsHigh && bearishPattern) ||
                    price <= localPosition.stop;

                if (shouldSell) {
                    const opResult = 1 //await sellOperation(tradePare);
                    if(opResult > 0) {
                        sellState.pushOrder({
                            action: price <= localPosition.stop ? "STOP_LOSS" : "SELL",
                            date: new Date(candle.timestamp).toLocaleDateString("eu-LT"),
                            time: new Date(candle.timestamp).toLocaleTimeString("eu-LT"),
                            price: localPosition.entry,
                            profit: localPosition.target,
                            rsi14: analysis.rsi14,
                            trend: analysis.trend,
                            pattern: analysis.pattern
                        });
                        sellState.setPosition({
                            entry: 0,
                            stop:0,
                            target: 0,
                            timestamp: 0
                        });
                    }
                }
            }
        }

        return (
            <Draggable>
                <div className="console-box" id="trade-comp-panel">
                    <div className="tab-container">
                             <span className="activeTime">
                           <span
                               className="panelTitle">Trade component</span>
                        </span>
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
                            <label>Pattern</label>
                            <span>{analysis.pattern}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Entry</label>
                            <span>{localPosition.entry}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Stop-lost</label>
                            <span>{localPosition.stop}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Target</label>
                            <span>{localPosition.target}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Timestamp</label>
                            <span>{localPosition.timestamp}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>Orders</label>
                            <span>{sellState.orders.length}</span>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }));

export default TradeClicker;


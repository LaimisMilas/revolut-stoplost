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
            const position = sellState.getPosition();

            if (position.entry === 0) {
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
                    }
                }
            } else {
                const reachedTakeProfit = price >= position.target;
                const trendIsDown = analysis.trend === "down";
                const rsiIsHigh = analysis.rsi14 > 30;
                const bearishPattern = analysis.pattern === "bearish_engulfing";

                const shouldSell =
                    (reachedTakeProfit && trendIsDown && rsiIsHigh && bearishPattern) ||
                    price <= position.stop;

                if (shouldSell) {
                    const opResult = 1 //await sellOperation(tradePare);
                    if(opResult > 0) {
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
                            <label>entry</label>
                            <span>{position.entry}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>stop</label>
                            <span>{position.stop}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>target</label>
                            <span>{position.target}</span>
                        </div>
                        <div className="checkbox-row">
                            <label>timestamp</label>
                            <span>{position.timestamp}</span>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }));

export default TradeClicker;


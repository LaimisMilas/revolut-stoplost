import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";

const TrailingBuyBotPanel =
    inject("buyState", "sellState", "buyPanelState", "indicatorReadState")(
        observer(({buyState, sellState, buyPanelState, indicatorReadState}) => {

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            return (
                <Draggable>
                    <div className="console-box" id="trailing-buy-bot-panel" hidden={buyPanelState.stopAllAction}>
                        <div className="tab-container">
                        <span className="activeTime">
                           <span
                               className="panelTitle">Trailing buy bot</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                            <button className="exit-button"
                                    onClick={() => handleCollapseButtonClick()}>
                                {checkBoxContainerState === true ? "▼" : "▲"}
                            </button>
                            <div hidden={checkBoxContainerState}>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>isActive</label>
                                    <span>sell:{indicatorReadState.trailingSellBot.isTrailingActive ? "true" : "false"}</span>
                                    <span>&nbsp;buy:{indicatorReadState.trailingBuyBot.isTrailingActive ? "true" : "false"}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>ActivateRSI</label>
                                    <span>sell:{Number(indicatorReadState.trailingSellBot.trailingActivateRSI).toFixed(2)}</span>
                                    <span>&nbsp;buy:{Number(indicatorReadState.trailingBuyBot.trailingActivateRSI).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>Percent</label>
                                    <span>{Number(indicatorReadState.trailingBuyBot.trailingPercent)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>Distance</label>
                                    <span>{Number(indicatorReadState.trailingBuyBot.trailingDistance).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>Point</label>
                                    <span>sell:{indicatorReadState.trailingSellBot.trailingPoint}</span>
                                    <span>&nbsp;buy:{indicatorReadState.trailingBuyBot.trailingPoint}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Trail signal</label>
                                    <span>sell:{indicatorReadState.trailingSellBot.sellSignal ? "true" : "false"}</span>
                                    <span>&nbsp;buy:{indicatorReadState.trailingBuyBot.buySignal ? "true" : "false"}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>Last RSI</label>
                                    <span>{Number(indicatorReadState.lastRSIValue).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Trend 1sec.</label>
                                    <span>{indicatorReadState.trendByPrice}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Trend 1min.</label>
                                    <span>{indicatorReadState.trendByPrice1min}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Trend dynamic</label>
                                    <span>{indicatorReadState.trendDynamic}</span>
                                    <span>&nbsp; ch:{indicatorReadState.dynamicTrendChunkSize}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Trend ch:34</label>
                                    <span>{indicatorReadState.calculateTrend(900,34)}</span>
                                </div>

                                <div className="checkbox-row">
                                    <label>Try counter</label>
                                    <span>sell:{sellState.countTrySell}</span>
                                    <span>&nbsp; buy:{buyState.countTryBuy}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Aroon trend</label>
                                    <span>{indicatorReadState.aroonTrend}</span>
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

export default TrailingBuyBotPanel;

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
                               className="panelTitle">Trailing</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                            <button className="exit-button"
                                    onClick={() => handleCollapseButtonClick()}>
                                {checkBoxContainerState === true ? "▼" : "▲"}
                            </button>
                            <div hidden={checkBoxContainerState}>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>Active</label>
                                    <span>sell:{indicatorReadState.trailingSellBot.isTrailingActive ? "true" : "false"}</span>
                                    <span>&nbsp;buy:{indicatorReadState.trailingBuyBot.isTrailingActive ? "true" : "false"}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Activate point</label>
                                    <span>sell:{Number(indicatorReadState.trailingSellBot.trailingActivateRSI).toFixed(2)}</span>
                                    <span>&nbsp;buy:{Number(indicatorReadState.trailingBuyBot.trailingActivateRSI).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Delta</label>
                                    <span>{Number(indicatorReadState.trailingBuyBot.trailingPercent)}%</span>
                                    <span>&nbsp;{Number(indicatorReadState.trailingBuyBot.trailingDistance).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Action point</label>
                                    <span>sell:{indicatorReadState.trailingSellBot.trailingPoint}</span>
                                    <span>&nbsp;buy:{indicatorReadState.trailingBuyBot.trailingPoint}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Trail signal</label>
                                    <span>sell:{indicatorReadState.trailingSellBot.sellSignal ? "true" : "false"}</span>
                                    <span>&nbsp;buy:{indicatorReadState.trailingBuyBot.buySignal ? "true" : "false"}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Last RSI14 </label>
                                    <span>{indicatorReadState.rsiTable[0]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default TrailingBuyBotPanel;

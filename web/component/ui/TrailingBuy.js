import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";

const TrailingBuy =
    inject("buyState", "sellState", "buyPanelState", "indicatorReadState")(
        observer(({buyState,sellState, buyPanelState, indicatorReadState}) => {

            const [stopAllAction, setStopAllAction] = useState(false);
            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });
            useEffect(() => {
            }, []);

            const handleOnChangeEvent = (event, key) => {

                if (key === "deltaRate") {
                    indicatorReadState.deltaRate = event.target.value;
                    indicatorReadState.isTrailingActive = false;
                }
                if (key === "trailingPrice") {
                    indicatorReadState.trailingActivatePoint = event.target.value;
                    indicatorReadState.isTrailingActive = false;
                }

                buyState.updateSystemCfg = false;
            };

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            const handleStopButtonClick = () => {
                stopAllAction === false ? setStopAllAction(true) : setStopAllAction(false);
               // sellState.systemCfg.cfg.linkedInLike.root.run = stopAllAction;
            }

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                buyState.msgs = [];
                sellState.msgs = [];
                sellState.rootStore.saveStorage();
                setTimeout(
                    () => setApplyButtonStyle({className: "apply-button"}), 700
                )
            };

            return (
                <Draggable>
                    <div className="console-box" id="trailing-buy-panel" hidden={buyPanelState.stopAllAction}>
                        <div className="tab-container">
                        <span className="activeTime">
                           <span
                               className="panelTitle">Trailing buy</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                            <button className="exit-button"
                                    onClick={() => handleCollapseButtonClick()}>
                                {checkBoxContainerState === true ? "▼" : "▲"}
                            </button>
                            <div hidden={checkBoxContainerState}>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"trailingPrice_id"}>Trailing Price</label>
                                    <input
                                        type="text"
                                        className="halfInput"
                                        id={"trailingPrice_id"}
                                        name={"trailingPrice_name"}
                                        value={Number(indicatorReadState.trailingActivatePoint).toFixed(2)}
                                        onChange={(event) => handleOnChangeEvent(event, "trailingPrice")}
                                    />
                                    <span>{Number(indicatorReadState.trailingPoint).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"deltaRate_id"}>Delta rate</label>
                                    <input
                                        type="text"
                                        className="halfInput"
                                        id={"deltaRate_id"}
                                        name={"deltaRate_name"}
                                        value={indicatorReadState.deltaRate}
                                        onChange={(event) => handleOnChangeEvent(event, "deltaRate")}
                                    />
                                    <span>{Number(indicatorReadState.deltaValue).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>Last RSI</label>
                                    <span>{Number(indicatorReadState.lastRSIValue).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={"limitBuy_id"}>RSI+Delta</label>
                                    <span>{(Number(indicatorReadState.lastRSIValue) + Number(indicatorReadState.deltaValue)).toFixed(2)}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Buy point reached</label>
                                    <span>{indicatorReadState.buyPointReached ? "true" : "false"}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>TickerIndex</label>
                                    <span>{indicatorReadState.tickerIndex}</span>
                                </div>
                                <button className={applyButtonStyle.className} onClick={handleApplyButtonClick}>Delete MSG
                                </button>
                                <button
                                    className={stopAllAction === true ? "stop-button stop-all-action-true" : "stop-button"}
                                    onClick={handleStopButtonClick}>
                                    {
                                        stopAllAction === false ? "Stop" : "Start"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default TrailingBuy;

import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";

const TrailingBuy =
    inject("buyState", "buyPanelState", "indicatorReadState")(
        observer(({buyState, buyPanelState, indicatorReadState}) => {

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(buyPanelState.getIsActionsStop());


            useEffect(() => {
                setStopAllAction(buyPanelState.getIsActionsStop());
            }, []);

            const handleOnChangeEvent = (event, key) => {
                setApplyButtonStyle({className: "apply-button-save"});

                if (key === "deltaRate") {
                    indicatorReadState.deltaRate = event.target.value;
                }
                if (key === "trailingPrice") {
                    indicatorReadState.trailingActivateRSI = event.target.value;
                }
                if (key === "limitBuy") {
                    indicatorReadState.limitRSIBuy = event.target.value;
                }

                buyState.updateSystemCfg = false;
            };

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                setTimeout(
                    () => setApplyButtonStyle({className: "apply-button"}), 700
                )
                buyState.updateSystemCfg = true;
            };

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            const handleStopButtonClick = () => {
                stopAllAction === false ? setStopAllAction(true) : setStopAllAction(false);
                buyState.systemCfg.cfg.linkedInLike.root.run = stopAllAction;
            }

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
                                        value={Number(indicatorReadState.trailingActivateRSI).toFixed(2)}
                                        onChange={(event) => handleOnChangeEvent(event, "trailingPrice")}
                                    />
                                    <span>{Number(indicatorReadState.trailingRSI).toFixed(2)}</span>
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
                                        htmlFor={"limitBuy_id"}>Limit Buy</label>
                                    <input
                                        type="text"
                                        id={"limitBuy_id"}
                                        name={"limitBuy_name"}
                                        value={indicatorReadState.limitRSIBuy}
                                        onChange={(event) => handleOnChangeEvent(event, "limitBuy")}
                                    />
                                </div>
                                <div className="checkbox-row">
                                    <label>Buy point reached</label>
                                    <span>{indicatorReadState.buyPointReached ? "true":"false"}</span>
                                </div>
                                <button className={applyButtonStyle.className}
                                        onClick={handleApplyButtonClick}>Apply
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

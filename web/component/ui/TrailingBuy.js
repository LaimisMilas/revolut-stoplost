import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";

const TrailingBuy =
    inject("buyState", "buyPanelState", "indicatorReadState")(
        observer(({buyState, buyPanelState, indicatorReadState}) => {

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);

            useEffect(() => {
            }, []);

            const handleOnChangeEvent = (event, key) => {

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

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
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
                            </div>
                        </div>
                    </div>
                </Draggable>
            );
        }));

export default TrailingBuy;

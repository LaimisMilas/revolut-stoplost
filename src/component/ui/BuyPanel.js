import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import Draggable from "react-draggable";
import {convertToNumber} from "../../utils/RevolutUtils";
import {doParabolicCorrelation} from "../../indicator/Correletion";
import {cleanData} from "../../utils/dataFilter";

const BuyPanel =
    inject("buyState", "buyPanelState", "indicatorReadState")(
        observer(({buyState, buyPanelState, indicatorReadState}) => {

            const parsePareFromURL = () => {
                let tmp = window.location.href.split("/trade/");
                return tmp[1].split("-")[0];
            }

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });

            const doRSIParabolicCorrelation = () => {
                const arrayIndex = 0;
                let last100RSIValue = indicatorReadState.last100RSIValue;
                last100RSIValue = last100RSIValue.slice(arrayIndex, indicatorReadState.last100RSIValue.length - 1);
                return doParabolicCorrelation(cleanData(last100RSIValue), "BuyPanel RSI correlation");
            }

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(buyPanelState.getIsActionsStop());
            const [tradePare, setTradePare] = useState(buyState.getTradePareDataByKey(parsePareFromURL()));
            const [currentCorrelation, setCurrentCorrelation] = useState(doRSIParabolicCorrelation());

            useEffect(() => {
                setStopAllAction(buyPanelState.getIsActionsStop());
                setTradePare(buyState.getTradePareDataByKey(parsePareFromURL()))
               setCurrentCorrelation(doRSIParabolicCorrelation());
            }, [buyState.systemCfg.cfg.linkedInLike.root.run, indicatorReadState.last100RSICounter]);

            const handleOnChangeEvent = (event, key) => {
                if(key === "aspectCorrelation"){
                    buyState.aspectCorrelation = convertToNumber(event.target.value);
                } else{
                    tradePare[key] = event.target.value;
                }
                setApplyButtonStyle({className: "apply-button-save"});
                buyState.updateSystemCfg = false;
            };

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                buyState.saveTradePareData(tradePare);
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
                    <div className="console-box" id="buy-panel" hidden={buyPanelState.stopAllAction}>
                        <div className="tab-container">
                        <span className="activeTime">
                           <span
                               className="panelTitle">BUY panel</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                            <button className="exit-button"
                                    onClick={() => handleCollapseButtonClick()}>
                                {checkBoxContainerState === true ? "▼" : "▲"}
                            </button>
                            <div hidden={checkBoxContainerState}>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={buyPanelState.rowConfig.exchPare.id}>{buyPanelState.rowConfig.exchPare.label}</label>
                                    <span>{tradePare.name}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={buyPanelState.rowConfig.targetPrice.id}>{buyPanelState.rowConfig.targetPrice.label}</label>
                                    <input
                                        type="text"
                                        id={buyPanelState.rowConfig.targetPrice.id}
                                        name={buyPanelState.rowConfig.targetPrice.name}
                                        value={tradePare.targetPrice}
                                        onChange={(event) => handleOnChangeEvent(event, buyPanelState.rowConfig.targetPrice.key)}
                                    />
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={buyPanelState.rowConfig.rsi.id}>{buyPanelState.rowConfig.rsi.label}</label>
                                    <input
                                        type="text"
                                        id={buyPanelState.rowConfig.rsi.id}
                                        name={buyPanelState.rowConfig.rsi.name}
                                        value={tradePare.rsi}
                                        onChange={(event) => handleOnChangeEvent(event, buyPanelState.rowConfig.rsi.key)}
                                    />
                                </div>
                                <div className="checkbox-row">
                                    <label>Aspect cor.</label>
                                    <input
                                        className="halfInput"
                                        type="text"
                                        value={buyState.aspectCorrelation}
                                        onChange={(event) => handleOnChangeEvent(event, "aspectCorrelation")}
                                    />
                                    <span>{currentCorrelation}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={buyPanelState.rowConfig.quantity.id}>{buyPanelState.rowConfig.quantity.label}</label>
                                    <input
                                        type="text"
                                        id={buyPanelState.rowConfig.quantity.id}
                                        name={buyPanelState.rowConfig.quantity.name}
                                        value={tradePare.quantity}
                                        onChange={(event) => handleOnChangeEvent(event, buyPanelState.rowConfig.quantity.key)}
                                    />
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

export default BuyPanel;

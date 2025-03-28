import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import Draggable from "react-draggable";
import {convertToNumber} from "../../utils/RevolutUtils";

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

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(buyPanelState.getIsActionsStop());
            const [tradePare, setTradePare] = useState(buyState.getTradePareDataByKey(parsePareFromURL()));
            const [hiddenField, setHiddenField] = useState(true);

            useEffect(() => {
                setStopAllAction(buyPanelState.getIsActionsStop());
                setTradePare(buyState.getTradePareDataByKey(parsePareFromURL()))
                indicatorReadState.calcParabolicCorrelation();
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
                                        htmlFor={buyPanelState.rowConfig.rsi.id}>{buyPanelState.rowConfig.rsi.label}</label>
                                    <input
                                        type="text"
                                        className="halfInput"
                                        id={buyPanelState.rowConfig.rsi.id}
                                        name={buyPanelState.rowConfig.rsi.name}
                                        value={tradePare.rsi}
                                        onChange={(event) => handleOnChangeEvent(event, buyPanelState.rowConfig.rsi.key)}
                                    />
                                    <span>{indicatorReadState.lastRSIValue}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Aspect cor.</label>
                                    <input
                                        className="halfInput"
                                        type="text"
                                        value={buyState.aspectCorrelation}
                                        onChange={(event) => handleOnChangeEvent(event, "aspectCorrelation")}
                                    />
                                    <span>{indicatorReadState.parabolicCorrelation}</span>
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

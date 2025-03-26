import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import {convertToNumber} from "../../utils/RevolutUtils";
import Draggable from "react-draggable";
import {doParabolicCorrelation} from "../../indicator/Correletion";
import {cleanData} from "../../utils/dataFilter";
import {calculateRSI} from "../../indicator/RSI14";

const SellPanel =
    inject("sellState", "sellPanelState","indicatorReadState")(
        observer(({sellState, sellPanelState,indicatorReadState}) => {

            const parsePareFromURL = () => {
                let tmp = window.location.href.split("/trade/");
                return tmp[1].split("-")[0];
            }

            const calcCurrentProf = () => {
                let value = ((convertToNumber(indicatorReadState.lastPriceValue) * 100) / tradePare.price) - 100;
                return value.toPrecision(4);
            };

            const doRSIParabolicCorrelation = () => {
                const arrayIndex = 0;
                let last100RSIValue = indicatorReadState.last100RSIValue;
                last100RSIValue = last100RSIValue.slice(arrayIndex, indicatorReadState.last100RSIValue.length - 1);
                return doParabolicCorrelation(cleanData(last100RSIValue), "SellPanel RSI correlation");
            }

            const doRSIParabolicCorrelation2 = () => {
                let data = indicatorReadState.getLastTickers(600 + 14, 30);
                return doParabolicCorrelation(calculateRSI(data), "SellPanel RSI correlation");
            }

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });
            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(sellPanelState.getIsActionsStop());
            const [tradePare, setTradePare] = useState(sellState.getTradePareDataByKey(parsePareFromURL()));
            const [currentCorrelation, setCurrentCorrelation] = useState(doRSIParabolicCorrelation2());

            useEffect(() => {
                setStopAllAction(sellPanelState.getIsActionsStop());
                setTradePare(sellState.getTradePareDataByKey(parsePareFromURL()))
                setTakeProfPrice(calcTakeProfPrice());
                setStopLostPrice(calcStopLostPrice());
                setCurrentProf(calcCurrentProf());
                setCurrentCorrelation(doRSIParabolicCorrelation2());
            }, [sellState.systemCfg.cfg.linkedInLike.root.run, indicatorReadState.last100RSICounter]);

            const calcTakeProfPrice = () => {
                let value = convertToNumber(tradePare.price) + ((convertToNumber(tradePare.price) * convertToNumber(tradePare.takeProf)) / 100);
                return value.toPrecision(4);
            };

            const calcStopLostPrice = () => {
                let value = convertToNumber(tradePare.price) - ((convertToNumber(tradePare.price) * (convertToNumber(tradePare.stopLost)) * (-1)) / 100);
                return value.toPrecision(4);
            };

            const [takeProfPrice, setTakeProfPrice] = useState(calcTakeProfPrice());
            const [stopLostPrice, setStopLostPrice] = useState(calcStopLostPrice());
            const [currentProf, setCurrentProf] = useState(calcCurrentProf());

            const handleOnChangeEvent = (event, key) => {
                if(key === "aspectCorrelation"){
                    sellState.aspectCorrelation = convertToNumber(event.target.value);
                } else{
                    tradePare[key] = event.target.value;
                }
                setTakeProfPrice(calcTakeProfPrice());
                setStopLostPrice(calcStopLostPrice());
                setApplyButtonStyle({className: "apply-button-save"});
                sellState.updateSystemCfg = false;
            };

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                sellState.saveTradePareData(tradePare);
                setTimeout(
                    () => setApplyButtonStyle({className: "apply-button"}), 700
                )
                sellState.updateSystemCfg = true;
            };

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            const handleStopButtonClick = () => {
                stopAllAction === false ? setStopAllAction(true) : setStopAllAction(false);
                sellState.systemCfg.cfg.linkedInLike.root.run = stopAllAction;
            }

            return (
                <Draggable>
                    <div className="console-box" id="labas_as_krabas" hidden={sellPanelState.stopAllAction}>
                        <div className="tab-container">
                        <span className="activeTime">
                            <span
                                className="panelTitle">SELL panel</span>, active time: {sellPanelState.active.timeDiff} min.
                        </span>
                            <button className="exit-button"
                                    onClick={() => handleCollapseButtonClick()}>
                                {checkBoxContainerState === true ? "▼" : "▲"}
                            </button>
                            <div hidden={checkBoxContainerState}>
                                <div className="checkbox-row">
                                    <label>{sellPanelState.rowConfig.exchPare.label}</label>
                                    <span>{tradePare.name}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={sellPanelState.rowConfig.price.id}>{sellPanelState.rowConfig.price.label}</label>
                                    <input
                                        type="text"
                                        id={sellPanelState.rowConfig.price.id}
                                        name={sellPanelState.rowConfig.price.name}
                                        value={tradePare.price}
                                        onChange={(event) => handleOnChangeEvent(event, sellPanelState.rowConfig.price.key)}
                                    />
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={sellPanelState.rowConfig.stopLost.id}>{sellPanelState.rowConfig.stopLost.label}</label>
                                    <input
                                        className="halfInput"
                                        type="text"
                                        id={sellPanelState.rowConfig.stopLost.id}
                                        name={sellPanelState.rowConfig.stopLost.name}
                                        value={tradePare.stopLost}
                                        onChange={(event) => handleOnChangeEvent(event, sellPanelState.rowConfig.stopLost.key)}
                                    />
                                    <span>{stopLostPrice}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={sellPanelState.rowConfig.takeProf.id}>{sellPanelState.rowConfig.takeProf.label}</label>
                                    <input
                                        className="halfInput"
                                        type="text"
                                        id={sellPanelState.rowConfig.takeProf.id}
                                        name={sellPanelState.rowConfig.takeProf.name}
                                        value={tradePare.takeProf}
                                        onChange={(event) => handleOnChangeEvent(event, sellPanelState.rowConfig.takeProf.key)}
                                    />
                                    <span>{takeProfPrice}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Current prof.</label>
                                    <span>{currentProf} %</span>
                                </div>
                                <div className="checkbox-row">
                                    <label>Aspect cor.</label>
                                    <input
                                        className="halfInput"
                                        type="text"
                                        value={sellState.aspectCorrelation}
                                        onChange={(event) => handleOnChangeEvent(event, "aspectCorrelation")}
                                    />
                                    <span>{currentCorrelation}</span>
                                </div>
                                <div className="checkbox-row">
                                    <label
                                        htmlFor={sellPanelState.rowConfig.quantity.id}>{sellPanelState.rowConfig.quantity.label}</label>
                                    <input
                                        type="text"
                                        id={sellPanelState.rowConfig.quantity.id}
                                        name={sellPanelState.rowConfig.quantity.name}
                                        value={tradePare.quantity}
                                        onChange={(event) => handleOnChangeEvent(event, sellPanelState.rowConfig.quantity.key)}
                                    />
                                </div>
                                <button className={applyButtonStyle.className} onClick={handleApplyButtonClick}>Apply
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

export default SellPanel;

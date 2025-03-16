import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';
import {convertToNumber} from "../../utils/RevolutUtils";

const StopLostPanel =
    inject("stopLostState","cfgPanelState")(
        observer(({stopLostState, cfgPanelState}) => {

            const parsePareFromURL = () => {
                let tmp = window.location.href.split("/trade/");
                return tmp[1].split("-")[0];
            }

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });
            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(cfgPanelState.getIsActionsStop());
            const [tradePare, setTradePare] = useState(stopLostState.getTradePareDataByKey(parsePareFromURL()));

            useEffect(() => {
                setStopAllAction(cfgPanelState.getIsActionsStop());
                setTradePare(stopLostState.getTradePareDataByKey(parsePareFromURL()))
                setTakeProfPrice(calcTakeProfPrice());
                setStopLostPrice(calcStopLostPrice());
            }, [stopLostState.systemCfg.cfg.linkedInLike.root.run]);

            const calcTakeProfPrice = () => {
                let value = convertToNumber(tradePare.price) + ((convertToNumber(tradePare.price) * convertToNumber(tradePare.takeProf)) / 100);
                return value.toPrecision(4);
            };

            const calcStopLostPrice = () => {
                let value = convertToNumber(tradePare.price) - ((convertToNumber(tradePare.price) * (convertToNumber(tradePare.stopLost)) * (-1))  / 100);
                return value.toPrecision(4);
            };

            const [takeProfPrice, setTakeProfPrice] = useState(calcTakeProfPrice());
            const [stopLostPrice, setStopLostPrice] = useState(calcStopLostPrice());

            const handleOnChangeEvent = (event, key) => {
                tradePare[key] = event.target.value;
                setTakeProfPrice(calcTakeProfPrice());
                setStopLostPrice(calcStopLostPrice());
                setApplyButtonStyle({className: "apply-button-save"});
                stopLostState.updateSystemCfg = false;
            };

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                stopLostState.saveTradePareData(tradePare);
                setTimeout(
                    () => setApplyButtonStyle({className: "apply-button"}), 700
                )
                stopLostState.updateSystemCfg = true;
            };

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            const handleStopButtonClick = () => {
                stopAllAction === false ? setStopAllAction(true) : setStopAllAction(false);
                stopLostState.systemCfg.cfg.linkedInLike.root.run = stopAllAction;
            }

            return (
                <div className="console-box" id="labas_as_krabas" hidden={cfgPanelState.stopAllAction}>
                    <div className="tab-container">
                        <span className="activeTime">
                            <span className="panelTitle">SELL panel</span>, active time: {cfgPanelState.active.timeDiff} min.
                        </span>
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgPanelState.rowConfig.price.id}>{cfgPanelState.rowConfig.price.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.price.id}
                                    name={cfgPanelState.rowConfig.price.name}
                                    value={tradePare.price}
                                    onChange={(event) => handleOnChangeEvent(event, cfgPanelState.rowConfig.price.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgPanelState.rowConfig.exchPare.id}>{cfgPanelState.rowConfig.exchPare.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.exchPare.id}
                                    name={cfgPanelState.rowConfig.exchPare.name}
                                    value={tradePare.name}
                                    onChange={(event) => handleOnChangeEvent(event, cfgPanelState.rowConfig.exchPare.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgPanelState.rowConfig.stopLost.id}>{cfgPanelState.rowConfig.stopLost.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.stopLost.id}
                                    name={cfgPanelState.rowConfig.stopLost.name}
                                    value={tradePare.stopLost}
                                    onChange={(event) => handleOnChangeEvent(event, cfgPanelState.rowConfig.stopLost.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label>SL price</label>
                                <span>{stopLostPrice}</span>
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgPanelState.rowConfig.takeProf.id}>{cfgPanelState.rowConfig.takeProf.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.takeProf.id}
                                    name={cfgPanelState.rowConfig.takeProf.name}
                                    value={tradePare.takeProf}
                                    onChange={(event) => handleOnChangeEvent(event, cfgPanelState.rowConfig.takeProf.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label>TP price</label>
                                <span>{takeProfPrice}</span>
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgPanelState.rowConfig.takeProfRsi.id}>{cfgPanelState.rowConfig.takeProfRsi.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.takeProfRsi.id}
                                    name={cfgPanelState.rowConfig.takeProfRsi.name}
                                    value={tradePare.takeProfRsi}
                                    onChange={(event) => handleOnChangeEvent(event, cfgPanelState.rowConfig.takeProfRsi.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgPanelState.rowConfig.quantity.id}>{cfgPanelState.rowConfig.quantity.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.quantity.id}
                                    name={cfgPanelState.rowConfig.quantity.name}
                                    value={tradePare.quantity}
                                    onChange={(event) => handleOnChangeEvent(event, cfgPanelState.rowConfig.quantity.key)}
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
            );
        }));

export default StopLostPanel;

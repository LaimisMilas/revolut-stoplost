import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import './css/CfgPanel.css';

const BuyPanel =
    inject("buyState", "cfgBuyPanelState")(
        observer(({buyState, cfgBuyPanelState}) => {

            const parsePareFromURL = () => {
                let tmp = window.location.href.split("/trade/");
                return tmp[1].split("-")[0];
            }

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(cfgBuyPanelState.getIsActionsStop());
            const [tradePare, setTradePare] = useState(buyState.getTradePareDataByKey(parsePareFromURL()));

            useEffect(() => {
                setStopAllAction(cfgBuyPanelState.getIsActionsStop());
                setTradePare(buyState.getTradePareDataByKey(parsePareFromURL()))
            }, [buyState.systemCfg.cfg.linkedInLike.root.run]);

            const handleOnChangeEvent = (event, key) => {
                //console.log("BuyPanel handleOnChangeEvent", event, key);
                tradePare[key] = event.target.value;
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
                <div className="console-box" id="buy-panel" hidden={cfgBuyPanelState.stopAllAction}>
                    <div className="tab-container">
                        <span className="activeTime">
                           <span className="panelTitle">BUY panel</span>, active time: {cfgBuyPanelState.active.timeDiff} min.
                        </span>
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.targetPrice.id}>{cfgBuyPanelState.rowConfig.targetPrice.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.targetPrice.id}
                                    name={cfgBuyPanelState.rowConfig.targetPrice.name}
                                    value={tradePare.targetPrice}
                                    onChange={(event) => handleOnChangeEvent(event, cfgBuyPanelState.rowConfig.targetPrice.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.exchPare.id}>{cfgBuyPanelState.rowConfig.exchPare.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.exchPare.id}
                                    name={cfgBuyPanelState.rowConfig.exchPare.name}
                                    value={tradePare.name}
                                    onChange={(event) => handleOnChangeEvent(event, cfgBuyPanelState.rowConfig.exchPare.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.rsi.id}>{cfgBuyPanelState.rowConfig.rsi.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.rsi.id}
                                    name={cfgBuyPanelState.rowConfig.rsi.name}
                                    value={tradePare.rsi}
                                    onChange={(event) => handleOnChangeEvent(event, cfgBuyPanelState.rowConfig.rsi.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.quantity.id}>{cfgBuyPanelState.rowConfig.quantity.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.quantity.id}
                                    name={cfgBuyPanelState.rowConfig.quantity.name}
                                    value={tradePare.quantity}
                                    onChange={(event) => handleOnChangeEvent(event, cfgBuyPanelState.rowConfig.quantity.key)}
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

export default BuyPanel;

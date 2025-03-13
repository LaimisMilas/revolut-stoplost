import {inject, observer} from 'mobx-react';
import React, {useState} from 'react';
import './css/CfgPanel.css';
import {CustomTimeout} from "../../utils/CustomTimeout";
import {convertToNumber} from "../../utils/RevolutUtils";

const StopLostPanel =
    inject("navigationState","stopLostState", "scrollState", "cfgPanelState", "authState", "timeOutState")(
        observer(({navigationState, stopLostState, scrollState, cfgPanelState, authState, timeOutState}) => {

            const handleCheckboxChange = (event, key) => {
                console.log("StopLostPanel handleCheckboxChange", event, key);
                if (key in cfgPanelState.rowConfig) {
                    if (key === "scroll") {
                        scrollState.cfg.root.run = event.target.checked;
                    } else {
                        stopLostState.setRunEntityCfg(key, event.target.value);
                    }
                    setApplyButtonStyle({className: "apply-button-save"});
                    setTakeProfPrice(calcTakeProfPrice());
                    setStopLostPrice(calcStopLostPrice());
                    stopLostState.updateSystemCfg = false;
                }
            };

            const calcTakeProfPrice = () => {
                let value = convertToNumber(tradePare.price) + ((convertToNumber(tradePare.price) * tradePare.takeProf) / 100);
                return value.toPrecision(4);
            };

            const calcStopLostPrice = () => {
                let value = convertToNumber(tradePare.price) - ((convertToNumber(tradePare.price) * (tradePare.stopLost) * (-1))  / 100);
                return value.toPrecision(4);
            };

            const parsePareFromURL = () => {
                let tmp = window.location.href.split("/trade/");
                return tmp[1].split("-")[0];
            }

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(cfgPanelState.getIsActionsStop());
            const [takeProfPrice, setTakeProfPrice] = useState(calcTakeProfPrice());
            const [stopLostPrice, setStopLostPrice] = useState(calcStopLostPrice());
            const [tradePare, setTradePare] = useState(stopLostState.getTradePareDataByKey(parsePareFromURL()));

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                stopLostState.save(stopLostState.userCfg.cfg, authState.user.uid," StopLostPanel.handleApplyButtonClick()");
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
                timeOutState.resetAllTimeOuts();
                if (stopAllAction) {
                    timeOutState.saveTimeOut(
                        new CustomTimeout(scrollState.scrollDown, 90, scrollState.cfg, navigationState), scrollState.cfg.scroll.key);
                }
            }

            const totalBadge = () => {
                const sum = (cfgPanelState.badge.like
                    + cfgPanelState.badge.follower
                    + cfgPanelState.badge.repost
                    + cfgPanelState.badge.quantity
                    + cfgPanelState.badge.accepter
                    + cfgPanelState.badge.connector);
                return sum > 0 ? (sum > 99 ? "99+": sum) : ''
            }

            const totalBadgeTitle = () => {
                const sum = (cfgPanelState.badge.like
                    + cfgPanelState.badge.follower
                    + cfgPanelState.badge.quantity
                    + cfgPanelState.badge.accepter
                    + cfgPanelState.badge.connector);
                return sum > 0 ? sum: ''
            }

            return (
                <div className="console-box" id="labas_as_krabas" hidden={cfgPanelState.stopAllAction}>
                    <div className="tab-container">
                        <span title={totalBadgeTitle()}
                              className="badge">{totalBadge()}
                        </span>
                        <span className="activeTime">
                            Active time: {cfgPanelState.active.timeDiff} min.
                        </span>
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgPanelState.badge.like > 0 ? (cfgPanelState.badge.like > 99 ? "99+" : cfgPanelState.badge.like) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.like.id}>{cfgPanelState.rowConfig.like.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.like.id}
                                    name={cfgPanelState.rowConfig.like.name}
                                    value={tradePare.price}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.like.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgPanelState.badge.repost > 0 ? (cfgPanelState.badge.repost > 99 ? "99+" : cfgPanelState.badge.repost) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.repost.id}>{cfgPanelState.rowConfig.repost.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.repost.id}
                                    name={cfgPanelState.rowConfig.repost.name}
                                    value={tradePare.stopLost}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.repost.key)}
                                />
                            </div>

                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgPanelState.badge.follower > 0 ? (cfgPanelState.badge.follower > 99 ? "99+" : cfgPanelState.badge.follower) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.follower.id}>{cfgPanelState.rowConfig.follower.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.follower.id}
                                    name={cfgPanelState.rowConfig.follower.name}
                                    value={tradePare.stopLost}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.follower.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count"> </span>
                                <label>SL price</label>
                                <span>{stopLostPrice}</span>
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge">{cfgPanelState.badge.subscriber > 0 ? (cfgPanelState.badge.accepter > 99 ? "99+" : cfgPanelState.badge.accepter) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.accepter.id}>{cfgPanelState.rowConfig.accepter.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.accepter.id}
                                    name={cfgPanelState.rowConfig.accepter.name}
                                    value={tradePare.takeProf}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.accepter.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count"> </span>
                                <label>TP price</label>
                                <span>{takeProfPrice}</span>
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgPanelState.badge.connector > 0 ? (cfgPanelState.badge.connector > 99 ? "99+" : cfgPanelState.badge.connector) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.connector.id}>{cfgPanelState.rowConfig.connector.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.connector.id}
                                    name={cfgPanelState.rowConfig.connector.name}
                                    value={tradePare.takeProfRsi}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.connector.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge">{cfgPanelState.badge.quantity > 0 ? (cfgPanelState.badge.quantity > 99 ? "99+" : cfgPanelState.badge.quantity) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.quantity.id}>{cfgPanelState.rowConfig.quantity.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.quantity.id}
                                    name={cfgPanelState.rowConfig.quantity.name}
                                    value={tradePare.quantity}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.quantity.key)}
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

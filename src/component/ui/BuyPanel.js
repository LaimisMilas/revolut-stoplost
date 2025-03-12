import {inject, observer} from 'mobx-react';
import React, {useState} from 'react';
import './css/CfgPanel.css';
import {CustomTimeout} from "../../utils/CustomTimeout";

const BuyPanel =
    inject("navigationState","buyState", "scrollState", "cfgBuyPanelState", "authState", "timeOutState")(
        observer(({navigationState, buyState, scrollState, cfgBuyPanelState, authState, timeOutState}) => {

            const handleCheckboxChange = (event, key) => {
                console.log("handleCheckboxChange", event, key);
                if (key in cfgBuyPanelState.rowConfig) {
                    if (key === "scroll") {
                        scrollState.cfg.root.run = event.target.checked;
                    } else {
                        buyState.setRunEntityCfg(key, event.target.value);
                    }
                    setApplyButtonStyle({className: "apply-button-save"});
                    buyState.updateSystemCfg = false;
                }
            };

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(cfgBuyPanelState.getIsActionsStop());

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                buyState.save(buyState.userCfg.cfg, authState.user.uid," cfgBuyPanelState.handleApplyButtonClick()");
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
                timeOutState.resetAllTimeOuts();
                if (stopAllAction) {
                    timeOutState.saveTimeOut(
                        new CustomTimeout(scrollState.scrollDown, 90, scrollState.cfg, navigationState), scrollState.cfg.scroll.key);
                }
            }

            const totalBadge = () => {
                const sum = (cfgBuyPanelState.badge.like
                    + cfgBuyPanelState.badge.follower
                    + cfgBuyPanelState.badge.repost
                    + cfgBuyPanelState.badge.subscriber
                    + cfgBuyPanelState.badge.accepter
                    + cfgBuyPanelState.badge.connector);
                return sum > 0 ? (sum > 99 ? "99+": sum) : ''
            }

            const totalBadgeTitle = () => {
                const sum = (cfgBuyPanelState.badge.like
                    + cfgBuyPanelState.badge.follower
                    + cfgBuyPanelState.badge.subscriber
                    + cfgBuyPanelState.badge.accepter
                    + cfgBuyPanelState.badge.connector);
                return sum > 0 ? sum: ''
            }

            return (
                <div className="console-box" id="buy-panel" hidden={cfgBuyPanelState.stopAllAction}>
                    <div className="tab-container">
                        <span title={totalBadgeTitle()}
                              className="badge">{totalBadge()}
                        </span>
                        <span className="activeTime">
                            Active time: {cfgBuyPanelState.active.timeDiff} min.
                        </span>
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgBuyPanelState.badge.like > 0 ? (cfgBuyPanelState.badge.like > 99 ? "99+" : cfgBuyPanelState.badge.like) : ''}</span>
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.like.id}>{cfgBuyPanelState.rowConfig.like.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.like.id}
                                    name={cfgBuyPanelState.rowConfig.like.name}
                                    value={buyState.userCfg.cfg.linkedInLike.like.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgBuyPanelState.rowConfig.like.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgBuyPanelState.badge.repost > 0 ? (cfgBuyPanelState.badge.repost > 99 ? "99+" : cfgBuyPanelState.badge.repost) : ''}</span>
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.repost.id}>{cfgBuyPanelState.rowConfig.repost.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.repost.id}
                                    name={cfgBuyPanelState.rowConfig.repost.name}
                                    value={buyState.userCfg.cfg.linkedInLike.repost.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgBuyPanelState.rowConfig.repost.key)}
                                />
                            </div>

                            <div className="checkbox-row">
                                <span
                                    className="badge notification-badge__count">{cfgBuyPanelState.badge.follower > 0 ? (cfgBuyPanelState.badge.follower > 99 ? "99+" : cfgBuyPanelState.badge.follower) : ''}</span>
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.follower.id}>{cfgBuyPanelState.rowConfig.follower.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.follower.id}
                                    name={cfgBuyPanelState.rowConfig.follower.name}
                                    value={buyState.userCfg.cfg.linkedInLike.follower.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgBuyPanelState.rowConfig.follower.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge">{cfgBuyPanelState.badge.subscriber > 0 ? (cfgBuyPanelState.badge.subscriber > 99 ? "99+" : cfgBuyPanelState.badge.subscriber) : ''}</span>
                                <label
                                    htmlFor={cfgBuyPanelState.rowConfig.subscriber.id}>{cfgBuyPanelState.rowConfig.subscriber.label}</label>
                                <input
                                    type="text"
                                    id={cfgBuyPanelState.rowConfig.subscriber.id}
                                    name={cfgBuyPanelState.rowConfig.subscriber.name}
                                    value={buyState.userCfg.cfg.linkedInLike.subscriber.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgBuyPanelState.rowConfig.subscriber.key)}
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

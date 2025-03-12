import {inject, observer} from 'mobx-react';
import React, {useState} from 'react';
import './css/CfgPanel.css';
import {CustomTimeout} from "../../utils/CustomTimeout";

const StopLostPanel =
    inject("navigationState","cfgState", "ruleState", "scrollState", "cfgPanelState", "authState", "timeOutState")(
        observer(({navigationState, cfgState, ruleState, scrollState, cfgPanelState, authState, timeOutState}) => {

            const handleCheckboxChange = (event, key) => {
                console.log("handleCheckboxChange", event, key);
                if (key in cfgPanelState.rowConfig) {
                    if (key === "scroll") {
                        scrollState.cfg.root.run = event.target.checked;
                    } else {
                        cfgState.setRunEntityCfg(key, event.target.value);
                    }
                    setApplyButtonStyle({className: "apply-button-save"});
                    cfgState.updateSystemCfg = false;
                }
            };

            const [applyButtonStyle, setApplyButtonStyle] = useState({
                className: "apply-button",
            });

            const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);
            const [stopAllAction, setStopAllAction] = useState(cfgPanelState.getIsActionsStop());

            const handleApplyButtonClick = () => {
                setApplyButtonStyle({className: "apply-button-apply"});
                cfgState.save(cfgState.userCfg.cfg, authState.user.uid," CfgPanelState.handleApplyButtonClick()");
                setTimeout(
                    () => setApplyButtonStyle({className: "apply-button"}), 700
                )
                cfgState.updateSystemCfg = true;
            };

            const handleCollapseButtonClick = () => {
                checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
            }

            const handleStopButtonClick = () => {
                stopAllAction === false ? setStopAllAction(true) : setStopAllAction(false);
                cfgState.systemCfg.cfg.linkedInLike.root.run = stopAllAction;
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
                    + cfgPanelState.badge.subscriber
                    + cfgPanelState.badge.accepter
                    + cfgPanelState.badge.connector);
                return sum > 0 ? (sum > 99 ? "99+": sum) : ''
            }

            const totalBadgeTitle = () => {
                const sum = (cfgPanelState.badge.like
                    + cfgPanelState.badge.follower
                    + cfgPanelState.badge.subscriber
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
                                    value={cfgState.userCfg.cfg.linkedInLike.like.value}
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
                                    value={cfgState.userCfg.cfg.linkedInLike.repost.value}
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
                                    value={cfgState.userCfg.cfg.linkedInLike.follower.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.follower.key)}
                                />
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
                                    value={cfgState.userCfg.cfg.linkedInLike.accepter.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.accepter.key)}
                                />
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
                                    value={cfgState.userCfg.cfg.linkedInLike.connector.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.connector.key)}
                                />
                            </div>
                            <div className="checkbox-row">
                                <span
                                    className="badge">{cfgPanelState.badge.subscriber > 0 ? (cfgPanelState.badge.subscriber > 99 ? "99+" : cfgPanelState.badge.subscriber) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.subscriber.id}>{cfgPanelState.rowConfig.subscriber.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.subscriber.id}
                                    name={cfgPanelState.rowConfig.subscriber.name}
                                    value={cfgState.userCfg.cfg.linkedInLike.subscriber.value}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.subscriber.key)}
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

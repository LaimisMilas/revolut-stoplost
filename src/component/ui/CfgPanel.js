import {inject, observer} from 'mobx-react';
import React, {useState} from 'react';
import './css/CfgPanel.css';
import {DEV_LOGIN_PAGE, LOGIN_PAGE} from "clicker-common/src/Config";
import {DEV_MODE} from "../../state/Config";
import {CustomTimeout} from "../../utils/CustomTimeout";

const CfgPanel =
    inject("navigationState","cfgState", "ruleState", "scrollState", "cfgPanelState", "authState", "timeOutState")(
        observer(({navigationState, cfgState, ruleState, scrollState, cfgPanelState, authState, timeOutState}) => {

            const handleCheckboxChange = (event, key) => {
                if (key in cfgPanelState.rowConfig) {
                    if (key === "scroll") {
                        scrollState.cfg.root.run = event.target.checked;
                    } else {
                        cfgState.setRunEntityCfg(key, event.target.checked);
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

            const userLoginInfo = () => {
                let isLoggedIn = (authState.user !== null);
                const loginUrl = DEV_MODE ? DEV_LOGIN_PAGE : LOGIN_PAGE;
                return (
                    <div className="user-line">
                        <label>User:</label>
                        {isLoggedIn ?
                            <a target={"_blank"}
                                     href={loginUrl + ""}>{authState.user.displayName}</a>                            :
                            <a target={"_blank"}
                               href={loginUrl + ""}>Login</a>
                        }
                    </div>
                )
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
                                    className="badge notification-badge__count">{cfgPanelState.badge.repost > 0 ? (cfgPanelState.badge.repost > 99 ? "99+" : cfgPanelState.badge.repost) : ''}</span>
                                <label
                                    htmlFor={cfgPanelState.rowConfig.repost.id}>{cfgPanelState.rowConfig.repost.label}</label>
                                <input
                                    type="text"
                                    id={cfgPanelState.rowConfig.repost.id}
                                    name={cfgPanelState.rowConfig.repost.name}
                                    checked={cfgState.userCfg.cfg.linkedInLike.repost.run}
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
                                    checked={cfgState.userCfg.cfg.linkedInLike.follower.run}
                                    onChange={(event) => handleCheckboxChange(event, cfgPanelState.rowConfig.follower.key)}
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
                                    checked={cfgState.userCfg.cfg.linkedInLike.subscriber.run}
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

export default CfgPanel;

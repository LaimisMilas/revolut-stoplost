import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickSell,
    convertToNumber, getRSIIndicator,
    readLastPrice,
    selectSellSum,
    selectSellSwitch,
    writeQuantity
} from "../../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";

const StopLostClicker = inject("stopLostState", "navigationState", "cfgPanelState",
    "timeOutState")(
    observer(({
                  stopLostState, navigationState, cfgPanelState,
                  timeOutState
              }) => {

        let logging = false;
        let logPrefix = " StopLostClicker";

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                let intervalTime = stopLostState.systemCfg.cfg.linkedInLike.rootTimeout;
                stopLostState.localInterval = setTimeout(executeWithInterval, intervalTime);
            };
            executeWithInterval().then();
            return () => {
                if (stopLostState.localInterval) {
                    clearInterval(stopLostState.localInterval);
                }
            }
        }, [stopLostState.reset]);

        const run = async () => {
            let cfg = stopLostState.systemCfg.cfg.linkedInLike.like;
            let root = stopLostState.systemCfg.cfg.linkedInLike.root;
            logging = cfg.log;
            navigationState.syncCurrentPageByWindowLocation();
            if (root.run && navigationState.nav.currentPage === navigationState.pages.feed) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.key);
                if (!hasActiveTimeOut && stopLostState.userCfg.cfg.linkedInLike[cfg.key].run) {
                    timeOutState.clearTimeOutsByKey(cfg.key);
                    await doStopLost(cfg, callback);
                }
            }
        }

        const doStopLost = async (cfg, callback) => {
            let tradeName = stopLostState.userCfg.cfg.linkedInLike.repost.value.split("-")[0];

            if(isStopLostReached()){
                console.log("Stop Lost Reached do Run SELL " + tradeName);
                const result = await sellOperation(tradeName);
                if(result === 400){
                    callback({key: cfg.key, result: result, parentId: 0, cover: 100});
                }
            } else {
                if(isTakeProfReached() && await isRSIUp()){
                    console.log("Take Prof Reached do Run SELL " + tradeName);
                    const result = await sellOperation(tradeName);
                    if(result === 400){
                        callback({key: cfg.key, result: result, parentId: 0, cover: 100});
                    }
                }
            }
        }

        const isRSIUp = async () => {
            if(Utils.getElByXPath("//iframe")){
                let assetValue = stopLostState.userCfg.cfg.linkedInLike.connector.value;
                let indicatorValue = await getRSIIndicator();
                let isRSIUp = indicatorValue >= convertToNumber(assetValue)
                console.log("StopLostClicker isRSIUp "
                    + ", assetValue: " + assetValue
                    + ", indicatorValue: " + indicatorValue
                    + ", isRSIUp: " + isRSIUp);
                return isRSIUp;
            }
            return false;
        }

        const isTakeProfReached = () => {
            let lastPrice = readLastPrice();
            let buyPrice = convertToNumber(stopLostState.userCfg.cfg.linkedInLike.like.value);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit > convertToNumber(stopLostState.userCfg.cfg.linkedInLike.accepter.value);
        }

        const isStopLostReached = () => {
            let lastPrice = readLastPrice();
            let buyPrice = convertToNumber(stopLostState.userCfg.cfg.linkedInLike.like.value);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit < convertToNumber(stopLostState.userCfg.cfg.linkedInLike.follower.value);
        }

        const sellOperation = async (tradeName) => {
            let result = await selectSellSwitch();
            if(result === 100){
                let quantityValue = stopLostState.userCfg.cfg.linkedInLike.subscriber.value;
                if(quantityValue.includes('%')){
                    quantityValue = quantityValue.toString()
                    if(quantityValue === '100%'){
                        result += await selectSellSum(100);
                    }
                    if(quantityValue === '75%'){
                        result += await selectSellSum(75);
                    }
                    if(quantityValue === '50%'){
                        result += await selectSellSum(50);
                    }
                    if(quantityValue === '25%'){
                        result += await selectSellSum(25);
                    }
                } else {
                    let quantity = convertToNumber(quantityValue);
                    result += await writeQuantity(quantity);
                }
            }

            if(result === 200){
                result += await clickSell(tradeName);
            }

            if(result === 300){
                stopLostState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
            }

            console.log("StopLostClicker sellOperation "+ tradeName + " done status: " + result);

            return result;
        }

        const callback = (result) => {
            logging && console.log(logPrefix + " callback result: " + JSON.stringify(result));
            if (result.result) {
                cfgPanelState.updateBadge(result.key, cfgPanelState.badge[result.key] + 1);
            }
        }

    }));

export default StopLostClicker;


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

const StopLostClicker = inject("stopLostState")(
    observer(({stopLostState}) => {

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
            let root = stopLostState.systemCfg.cfg.linkedInLike.root;
            if (root.run) {
                await doStopLost();
            }
        }

        const doStopLost = async () => {

            let tradePare = stopLostState.currentTradePare;

            if(isStopLostReached(tradePare)){
                console.log("Stop Lost Reached do Run SELL " + tradePare.name);
                await sellOperation(tradePare);
            } else {
                if(isTakeProfReached(tradePare) && await isRSIUp(tradePare)){
                    console.log("Take Prof Reached do Run SELL " + tradePare.name);
                    await sellOperation(tradePare);
                }
            }
        }

        const isRSIUp = async (tradePare) => {
            if(Utils.getElByXPath("//iframe")){
                let assetValue = tradePare.takeProfRsi;
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

        const isTakeProfReached = (tradePare) => {
            let lastPrice = readLastPrice();
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit > convertToNumber(tradePare.takeProf);
        }

        const isStopLostReached = (tradePare) => {
            let lastPrice = readLastPrice();
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit < convertToNumber(tradePare.stopLost);
        }

        const sellOperation = async (tradePare) => {
            let result = await selectSellSwitch();
            if(result === 100){
                let quantityValue = tradePare.quantity;
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
                result += await clickSell(tradePare.key);
            }

            if(result === 300){
                stopLostState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
            }

            console.log("StopLostClicker sellOperation "+ tradePare.name + " done status: " + result);

            return result;
        }

    }));

export default StopLostClicker;


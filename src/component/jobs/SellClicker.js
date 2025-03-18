import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickSell,
    convertToNumber,
    getNowDate,
    selectSellSum,
    selectSellSwitch,
    writeQuantity
} from "../../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";
import {
    doParabolicCorrelation,
    simpleMovingAverage
} from "../../utils/IndicatorsUtils";

const SellClicker = inject("sellState", "buyState", "indicatorReadState")(
    observer(({sellState, buyState, indicatorReadState}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                let intervalTime = sellState.systemCfg.cfg.linkedInLike.rootTimeout;
                sellState.localInterval = setTimeout(executeWithInterval, intervalTime);
            };
            executeWithInterval().then();
            return () => {
                if (sellState.localInterval) {
                    clearInterval(sellState.localInterval);
                }
            }
        }, [sellState.reset]);

        const run = async () => {
            let root = sellState.systemCfg.cfg.linkedInLike.root;
            if (root.run) {
                await doStopLost();
            }
        }

        const doStopLost = async () => {
            let tradePare = sellState.getCurrentTradePare();
            if(indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            if(isStopLostReached(tradePare)){
                await sellOperation(tradePare, "stopLost");
            } else {
                if(isTakeProfReached(tradePare)
                    && await isRSIUp(tradePare)
                    && await doRSIParabolicCorrelation() < -0.80){
                    await sellOperation(tradePare, "takeProf");
                }
            }
        }

        const sellOperation = async (tradePare, caller) => {
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
                //result += 100;
                console.log("StopLostClicker clickSell "
                    + ", readLastPrice: " + indicatorReadState.lastPriceValue
                    + ", RSI 14: " + indicatorReadState.lastRSIValue
                    + ", price: " + tradePare.price
                    + ", caller: " + caller
                    + ", time: " +  getNowDate());
            }
            if(result === 300){
                sellState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                if(caller === "stopLost"){
                    buyState.getCurrentTradePare().targetPrice = indicatorReadState.lastPriceValue + ((indicatorReadState.lastPriceValue * 1)/100);
                    buyState.getCurrentTradePare().rsi = 50;
                    result += 100;
                } else if(caller === "takeProf"){
                    buyState.getCurrentTradePare().targetPrice = indicatorReadState.lastPriceValue;
                    buyState.getCurrentTradePare().rsi = 30;
                    result += 100;
                }
                buyState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
            }
            console.log("StopLostClicker sellOperation "+ tradePare.name + " done status: " + result);
            return result;
        }

        const isRSIUp = async (tradePare) => {
            if(Utils.getElByXPath("//iframe")){
                let assetValue = tradePare.takeProfRsi;
                return indicatorReadState.lastRSIValue >= convertToNumber(assetValue);
            }
            return false;
        }

        const isTakeProfReached = (tradePare) => {
            let lastPrice = indicatorReadState.lastPriceValue;
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit > convertToNumber(tradePare.takeProf);
        }

        const isStopLostReached = (tradePare) => {
            let lastPrice = indicatorReadState.lastPriceValue;
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit < convertToNumber(tradePare.stopLost);
        }

        const doRSIParabolicCorrelation = async () => {
            let last100RSIValue = indicatorReadState.last100RSIValue;
            return doParabolicCorrelation(simpleMovingAverage(last100RSIValue,indicatorReadState.period), "SELL RSI + parabolic");
        }

    }));

export default SellClicker;


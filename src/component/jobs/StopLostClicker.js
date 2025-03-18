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
    detectFractalPattern,
    doParabolicCorrelation,
    findDivergence,
    simpleMovingAverage
} from "../../utils/IndicatorsUtils";

const StopLostClicker = inject("stopLostState", "buyState", "indicatorReadState")(
    observer(({stopLostState, buyState, indicatorReadState}) => {

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
            let tradePare = stopLostState.getCurrentTradePare();
            //await isRSIMovesDown();
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
                //result += await clickSell(tradePare.key);
                result += 100;
                console.log("StopLostClicker clickSell "
                    + ", readLastPrice: " + indicatorReadState.lastPriceValue
                    + ", RSI 14: " + indicatorReadState.lastRSIValue
                    + ", price: " + tradePare.price
                    + ", caller: " + caller
                    + ", time: " +  getNowDate());
            }
            if(result === 300){
                stopLostState.systemCfg.cfg.linkedInLike.root.run = false;
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
            return doParabolicCorrelation(simpleMovingAverage(last100RSIValue,3), "SELL RSI");
        }

        const doPriceParabolicCorrelation = async () => {
            let last100PriceValue = indicatorReadState.last100PriceValue;
            return doParabolicCorrelation(simpleMovingAverage(last100PriceValue,3), "SELL Price");
        }

        const isRSIMovesDown = async () => {
            let last100RSIValue = indicatorReadState.last100RSIValue;
            let last100PriceValue = indicatorReadState.last100PriceValue;
            if (indicatorReadState.last100RSIValue.length > 99) {
                await doRSIParabolicCorrelation();
                await doPriceParabolicCorrelation();
                console.log(findDivergence(last100PriceValue, last100RSIValue));
                console.log(detectFractalPattern(last100RSIValue, "SELL RSI"));
                console.log(detectFractalPattern(last100PriceValue, "SELL Price"));
                // console.log("findMACDCrossovers: " + JSON.stringify(findMACDCrossovers(last100PriceValue)));
            }
        }

    }));

export default StopLostClicker;


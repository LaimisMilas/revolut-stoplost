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
import {cleanData} from "../../utils/dataFilter";
import {doParabolicCorrelation} from "../../indicator/Correletion";
import {calculateRSI} from "../../indicator/RSI14";

const SellClicker = inject("sellState", "buyState", "indicatorReadState")(
    observer(({sellState, buyState, indicatorReadState}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                sellState.localInterval = setTimeout(executeWithInterval, 5000);
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
                await doSell();
            }
        }

        const doSell = async () => {
            let tradePare = sellState.getCurrentTradePare();
            if(indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            if(isStopLostReached(tradePare)){
                await sellOperation(tradePare, null , "stopLost");
            } else {
                if(isTakeProfReached(tradePare)){
                    const correlation = await doRSIParabolicCorrelation2();
                    if(correlation < sellState.aspectCorrelation){
                        await sellOperation(tradePare, correlation, "takeProf");
                    } else {
                        console.log("SellClicker doSell failure correlation: " + correlation);
                    }
                }
            }
        }

        const sellOperation = async (tradePare, correlation, caller) => {
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
                let last100RSIValue = indicatorReadState.last100RSIValue;
                const msg = "SellClicker clickSell "
                    + ", lastPriceValue: " + indicatorReadState.lastPriceValue
                    + ", lastRSIValue: " + indicatorReadState.lastRSIValue
                    + ", targetPrice: " + tradePare.targetPrice
                    + ", aspectCorrelation: " + sellState.aspectCorrelation
                    + ", correlation: " + correlation
                    + ", RSI data: " + JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1))
                    + ", time: " + getNowDate();
                sellState.saveMsg(msg);
                console.log(msg);
            }
            if(result === 300){
                sellState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                if(caller === "stopLost"){
                    const newTargetPrice = indicatorReadState.lastPriceValue + ((indicatorReadState.lastPriceValue * 1)/100);
                    buyState.getCurrentTradePare().targetPrice = Number(newTargetPrice).toFixed(2);
                    const newRSIValue = indicatorReadState.lastRSIValue + ((indicatorReadState.lastRSIValue * 1)/100);
                    buyState.getCurrentTradePare().rsi = Number(newRSIValue).toFixed(0);
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
                let assetValue = tradePare.takeProfRsi;
                return indicatorReadState.lastRSIValue >= convertToNumber(assetValue);
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
            const arrayIndex = 0;
            let last100RSIValue = indicatorReadState.last100RSIValue;
            last100RSIValue = last100RSIValue.slice(arrayIndex, indicatorReadState.last100RSIValue.length - 1);
            //last100RSIValue = simpleMovingAverage(last100RSIValue,indicatorReadState.period);
            return doParabolicCorrelation(cleanData(last100RSIValue), "SELL RSI + parabolic");
        }

        const doRSIParabolicCorrelation2 = async () => {
            let data = indicatorReadState.getLastTickers(600 + 14, 30);
            return doParabolicCorrelation(calculateRSI(data), "Buy RSI + parabolic");
        }

    }));

export default SellClicker;


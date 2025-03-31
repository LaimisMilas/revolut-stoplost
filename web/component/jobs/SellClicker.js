import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickSell,
    convertToNumber,
    getNowDate,
    selectSellSum,
    selectSellSwitch,
    writeQuantity
} from "../../../src/utils/RevolutUtils";

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
                    const correlation = indicatorReadState.parabolicCorrelation;
                    if(correlation < sellState.aspectCorrelation){
                        await sellOperation(tradePare, correlation, "takeProf");
                    }
                }
            }
        }

        const sellOperation = async (tradePare, correlation, caller) => {
            let result = 300;
            if(result === 300){
                sellState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                if(caller === "stopLost"){
                    const newTargetPrice = Number(indicatorReadState.lastPriceValue) + ((Number(indicatorReadState.lastPriceValue) * 1)/100);
                    buyState.getCurrentTradePare().targetPrice = Number(newTargetPrice).toFixed(2);
                    const newRSIValue = Number(indicatorReadState.lastRSIValue) + ((Number(indicatorReadState.lastRSIValue) * 2)/100);
                    buyState.getCurrentTradePare().rsi = Number(newRSIValue).toFixed(0);
                    result += 100;
                } else if(caller === "takeProf"){
                    buyState.getCurrentTradePare().targetPrice = Number(indicatorReadState.lastPriceValue);
                    buyState.getCurrentTradePare().rsi = 30;
                    result += 100;
                }

                buyState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
                const msg = {};
                msg.type = "SELL";
                msg.name = tradePare.name;
                msg.price = Number(tradePare.price).toFixed(4);
                msg.stopLost = Number(tradePare.stopLost).toFixed(4);
                msg.takeProf = Number(tradePare.takeProf).toFixed(4);
                msg.quantity = tradePare.quantity;
                msg.lastPriceValue = Number(indicatorReadState.lastPriceValue).toFixed(4);
                msg.lastRSIValue = Number(indicatorReadState.lastRSIValue).toFixed(2);
                msg.aspectCorrelation = sellState.aspectCorrelation;
                msg.correlation = correlation;
              //  msg.rsiData = JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1));
                msg.time = Date.now();
                sellState.saveMsg(msg);
            }
            return result;
        }

        const isTakeProfReached = (tradePare) => {
            let lastPrice = indicatorReadState.lastPriceValue;
            if(lastPrice <= 0){
                return false;
            }
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit > convertToNumber(tradePare.takeProf);
        }

        const isStopLostReached = (tradePare) => {
            let lastPrice = indicatorReadState.lastPriceValue;
            if(lastPrice <= 0){
                return false;
            }
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return currentProfit < convertToNumber(tradePare.stopLost);
        }

    }));

export default SellClicker;


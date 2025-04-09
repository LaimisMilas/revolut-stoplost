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
import {TrailingBuyBot} from "../../../src/indicator/TrailingBuyBot";

const SellClicker = inject("sellState", "buyState", "indicatorReadState")(
    observer(({sellState, buyState, indicatorReadState}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                sellState.localInterval = setTimeout(executeWithInterval, 175);
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

        function discountTP(discount) {
            const newTP = sellState.getCurrentTradePare().takeProf - discount;
            sellState.getCurrentTradePare().takeProf = newTP;
        }

        const doSell = async () => {
            let tradePare = sellState.getCurrentTradePare();
            if(indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            if(isStopLostReached(tradePare)){
                await sellOperation(tradePare, indicatorReadState.parabolicCorrelation, "stopLost");
            } else {
                if(isTakeProfReached(tradePare) && indicatorReadState.trendByPrice === "down"){
                    const correlation = indicatorReadState.parabolicCorrelation;
                    if(correlation < tradePare.aspectCorrelation){
                        await sellOperation(tradePare, correlation, "takeProf");
                    }
                }
            }
            if(sellState.countTrySell > 600){
                discountTP(0.00001);
            } else if (sellState.countTrySell > 500){
                discountTP(0.00001);
            }
            else if (sellState.countTrySell > 300){
                discountTP(0.0001);
            }
            else if (sellState.countTrySell > 200){
                discountTP(0.0001);
            }
            sellState.countTrySell ++;
        }

        const sellOperation = async (tradePare, correlation, caller) => {
            let result = 300;
            if(result === 300){
                sellState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                if(caller === "stopLost"){
                    const newTargetPrice = Number(indicatorReadState.lastPriceValue) + ((Number(indicatorReadState.lastPriceValue) * 1)/100);
                    buyState.getCurrentTradePare().targetPrice = Number(newTargetPrice).toFixed(2);
                   // const newRSIValue = Number(indicatorReadState.lastRSIValue) + ((Number(indicatorReadState.lastRSIValue) * 2)/100);
                   // buyState.getCurrentTradePare().rsi = Number(newRSIValue).toFixed(0);
                   // buyState.getCurrentTradePare().rsi = 30;
                    result += 100;
                } else if(caller === "takeProf"){
                    buyState.getCurrentTradePare().targetPrice = Number(indicatorReadState.lastPriceValue);
                  //  buyState.getCurrentTradePare().rsi = 30;
                    result += 100;
                }
                let rsi = indicatorReadState.lastRSIValue;
                if(rsi < 40){
                    rsi = 50;
                }
                indicatorReadState.trailingBuyBot = new TrailingBuyBot({ trailingActivateRSI: rsi, trailingPercent: 10 });

                buyState.systemCfg.cfg.linkedInLike.root.run = true;
                sellState.getCurrentTradePare().takeProf = 1.2;

                indicatorReadState.buyPointReached = false;
                indicatorReadState.isTrailingActive = false;
                indicatorReadState.trailingPoint = 0;
                indicatorReadState.deltaValue = 0;
                indicatorReadState.trailingBuyBot.reset();

                sellState.countTrySell  = 0;

                result += 100;
                await saveMsg(tradePare, correlation, "SELL");
            }
            return result;
        }

        const saveMsg = async (tradePare, correlation, type) => {
            const msg = {};
            msg.type = type;
            msg.name = tradePare.name;
            msg.price = Number(tradePare.price).toFixed(2);
            msg.stopLost = sellState.getCurrentTradePare().stopLost
            msg.takeProf = sellState.getCurrentTradePare().takeProf;
            msg.quantity = tradePare.quantity;
            msg.lastPriceValue = Number(indicatorReadState.lastPriceValue).toFixed(2);
            msg.lastRSIValue = Number(indicatorReadState.lastRSIValue).toFixed(2);
            msg.aspectCorrelation = sellState.aspectCorrelation;
            msg.correlation = correlation;
            msg.leftLineCorrelation = indicatorReadState.leftLineCorrelation;
            msg.bullishLineCorrelation = indicatorReadState.bullishLineCorrelation;
            msg.bearishLineCorrelation = indicatorReadState.bearishLineCorrelation;
            msg.sinusoidCorrelation = indicatorReadState.sinusoidCorrelation;
            msg.divergence = indicatorReadState.divergence;
            msg.trendByPrice = indicatorReadState.trendByPrice;
            msg.trendByPrice1min = indicatorReadState.trendByPrice1min;
            msg.aroonTrend = indicatorReadState.aroonTrend;

            //msg.rsiData = JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1));
            msg.time = Date.now();
            sellState.saveMsg(msg);
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


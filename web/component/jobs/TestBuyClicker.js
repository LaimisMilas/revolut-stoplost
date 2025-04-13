import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {calcStopLost, calcStopLostTakeProf, calcTakeProfit, calculateTP_SL} from "../../../src/indicator/ATR";

const TestBuyClicker = inject("buyState", "sellState", "indicatorReadState","tickerService")(
    observer(({buyState, sellState, indicatorReadState, tickerService}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                indicatorReadState.localInterval = setTimeout(executeWithInterval, 175);
            };
            executeWithInterval().then();
            return () => {
                if (buyState.localInterval) {
                    clearInterval(buyState.localInterval);
                }
            }
        }, [buyState.reset]);

        const run = async () => {
            let root = buyState.systemCfg.cfg.linkedInLike.root;
            if (root.run) {
                await doBuy();
            }
        }

        const doBuy = async () => {
            let tradePare = buyState.getCurrentTradePare();
            if (indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            // const isRSIDown = await isRSIDown(tradePare, indicatorReadState.lastRSIValue);
            const correlation = indicatorReadState.parabolicCorrelation;
            // indicatorReadState.buyPointReached;
            const aroon = indicatorReadState.aroonTrend.split(":");

            if (indicatorReadState.trailingBuyBot.shouldBuy()
                && correlation > tradePare.aspectCorrelation
                && indicatorReadState.trendDynamic === "up") {
                await buyOperation(tradePare, correlation);
            }

            if(buyState.countTryBuy > 800){
                indicatorReadState.dynamicTrendChunkSize = 1
            }
            else if (sellState.countTryBuy > 600){
                indicatorReadState.dynamicTrendChunkSize = 2
            }
            else if (buyState.countTryBuy > 400){
                indicatorReadState.dynamicTrendChunkSize = 3
            }
            else if (buyState.countTryBuy > 300){
                indicatorReadState.dynamicTrendChunkSize = 4
            }
            else {
                indicatorReadState.dynamicTrendChunkSize = 5
            }
            buyState.countTryBuy ++;
            buyState.rootStore.saveStorage();
        }

        const buyOperation = async (tradePare, correlation) => {
            let result = 300;
            if (result === 300) {
                buyState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                sellState.getCurrentTradePare().price = Number(indicatorReadState.lastPriceValue).toFixed(2);
                result += 100;
                sellState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;

                if(tickerService.historyData.length < 0){
                    const price = sellState.getCurrentTradePare().price;
                    const trend = indicatorReadState.trendByPrice;
                    const values = calcStopLostTakeProf(price, tickerService.historyData, trend);
                    sellState.getCurrentTradePare().stopLost = values.stopLoss;
                    sellState.getCurrentTradePare().takeProf = values.takeProfit;
                }

                if(indicatorReadState.lastRSIValue > 45){
                    sellState.getCurrentTradePare().takeProf = 0.2;
                } else if(indicatorReadState.lastRSIValue > 40){
                    sellState.getCurrentTradePare().takeProf = 0.5;
                } else if(indicatorReadState.lastRSIValue > 35){
                    sellState.getCurrentTradePare().takeProf = 0.8;
                } else if(indicatorReadState.lastRSIValue > 30){
                    sellState.getCurrentTradePare().takeProf = 1.2;
                } else if(indicatorReadState.lastRSIValue > 25){
                    sellState.getCurrentTradePare().takeProf = 1.4;
                } else {
                    sellState.getCurrentTradePare().takeProf = 1.6;
                }

                indicatorReadState.buyPointReached = false;
                indicatorReadState.isTrailingActive = false;
                indicatorReadState.trailingPoint = 0;
                indicatorReadState.deltaValue = 0;
                indicatorReadState.trailingBuyBot.reset();

                buyState.countTryBuy = 0;
                await saveMsg(tradePare, correlation, "BUY");
            }
            return result;
        }

        const saveMsg = async (tradePare, correlation, type) => {
            const msg = {};
            msg.type = type;
            msg.name = tradePare.name;
            msg.targetPrice = Number(tradePare.targetPrice).toFixed(4);
            msg.rsi = Number(tradePare.rsi).toFixed(2);
            msg.quantity = tradePare.quantity;
            msg.lastPriceValue = Number(indicatorReadState.lastPriceValue).toFixed(4);
            msg.lastRSIValue = Number(indicatorReadState.lastRSIValue).toFixed(2);
            msg.aspectCorrelation = buyState.aspectCorrelation;
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
            buyState.saveMsg(msg);
        }

    }));

export default TestBuyClicker;


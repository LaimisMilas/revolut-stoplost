import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickSell,
    convertToNumber, getClickSell,
    getNowDate, hasOrderMessage,
    selectSellSum,
    selectSellSwitch,
    writeQuantity
} from "../../utils/RevolutUtils";
import {postSellProcess} from "./sell/PostSellProcess";

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

        function discountTP(discount) {
            const newTP = sellState.getCurrentTradePare().takeProf - discount;
            sellState.getCurrentTradePare().takeProf = newTP;
        }

        const doSell = async () => {
            let tradePare = sellState.getCurrentTradePare();
            if(indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }

            sellState.trySellPrices.push(indicatorReadState.lastPriceValue);

            if(isStopLostReached(tradePare)){
                //let result = indicatorReadState.calculateTrend(900,indicatorReadState.dynamicTrendChunkSizeDefault);
                //if(result === "down"){
                    await sellOperation(tradePare, indicatorReadState.parabolicCorrelation, "stopLost");
                    indicatorReadState.storeTicker(900);
                    indicatorReadState.dynamicTrendChunkSizeDefault = 6; //kad pirktu su didesniu trendu, nes tiketima false signalai
               // }
            } else {
                if(isTakeProfReached(tradePare) && indicatorReadState.trendDynamic === "down"){
                    const correlation = Number(indicatorReadState.parabolicCorrelation);
                    if(correlation < Number(tradePare.aspectCorrelation)){
                        await sellOperation(tradePare, correlation, "takeProf");
                    }
                }
            }
            if(sellState.countTrySell > 600){
                discountTP(0.0001);
            }
            else if (sellState.countTrySell > 500){
                discountTP(0.0001);
            }
            else if (sellState.countTrySell > 300){
                discountTP(0.0001);
            }
            else if (sellState.countTrySell > 200){
                discountTP(0.0001);
            }

            if(sellState.countTrySell > 1200){
                indicatorReadState.dynamicTrendChunkSize = 1
            }
            else if (sellState.countTrySell > 900){
                indicatorReadState.dynamicTrendChunkSize = 2
            }
            else if (sellState.countTrySell > 600){
                indicatorReadState.dynamicTrendChunkSize = 3
            }
            else if (sellState.countTrySell > 300){
                indicatorReadState.dynamicTrendChunkSize = 4
            }
            else {
                indicatorReadState.dynamicTrendChunkSize = indicatorReadState.dynamicTrendChunkSizeDefault;
            }

            if(isTakeProfReached(tradePare)){
                indicatorReadState.dynamicTrendChunkSize = 1
            }

            if(takeProfDiff(tradePare) > 1){
                indicatorReadState.dynamicTrendChunkSize = 1
                sellState.getCurrentTradePare().aspectCorrelation = -0.2;
            }

            sellState.countTrySell ++;
            sellState.rootStore.saveStorage();
        }

        const sellOperation = async (tradePare, correlation, caller) => {
            let result= 0;
            let el = await selectSellSwitch();
            //is switched to sell
            if(el.hasAttribute('aria-selected') && el.getAttribute('aria-selected') === 'false'){
                return;
            } else {
                result = 100;
            }
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
                //is quantity selected
                el = await getClickSell(tradePare.key);
                if(el.hasAttribute('disabled')){
                    return;
                }
            }
            if(result === 200){
                result += await clickSell(tradePare.key);
                //is sold
                if(await hasOrderMessage()){
                    result += 100;
                }
            }
            if(result === 400){
                await postSellProcess(buyState, sellState, indicatorReadState, tradePare, correlation, caller);
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

        const takeProfDiff = (tradePare) => {
            let lastPrice = indicatorReadState.lastPriceValue;
            if(lastPrice <= 0){
                return 0;
            }
            let buyPrice = convertToNumber(tradePare.price);
            let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
            return  currentProfit - convertToNumber(tradePare.takeProf);
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


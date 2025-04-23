import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickOrderHistory,
    clickSell,
    convertToNumber, getClickSell,
    getNowDate, getOrderType, hasOrderMessage,
    selectSellSum,
    selectSellSwitch,
    writeQuantity
} from "../../utils/RevolutUtils";
import {postSellProcess} from "./sell/PostSellProcess";
import {isStopLostReached, isTakeProfReached, preSellProcess} from "./sell/PreSellProcess";

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

           // sellState.trySellPrices.push(indicatorReadState.lastPriceValue);

            if(isStopLostReached(tradePare, indicatorReadState)){
                await sellOperation(tradePare, indicatorReadState.parabolicCorrelation, "stopLost");
            } else {
                if(isTakeProfReached(tradePare, indicatorReadState) && indicatorReadState.trendDynamic === "down"){
                    const correlation = Number(indicatorReadState.parabolicCorrelation);
                    if(correlation < Number(tradePare.aspectCorrelation)){
                        await sellOperation(tradePare, correlation, "takeProf");
                    }
                }
            }
            await preSellProcess(buyState, sellState, indicatorReadState, tradePare);
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
                //result += await clickSell(tradePare.key);
                //is sold
                result += await sellApproval();
                if(await sellApproval() < 200){
                   // return result; // no approved
                }
            }

            if(result > 100){
                await postSellProcess(buyState, sellState, indicatorReadState, tradePare, correlation, caller);
            }
            return result;
        }

        const sellApproval = async () => {
            let result = 0;
            result += await clickOrderHistory();
            if(result > 0 && await hasOrderMessage()){
                let orderType = await getOrderType();
                if(orderType.includes("Pardavimo")){
                    console.log("orderType:" + orderType);
                    result += 100;
                }
            }
            return result;
        }

    }));

export default SellClicker;


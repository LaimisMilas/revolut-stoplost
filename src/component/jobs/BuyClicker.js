import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickBuy,
    convertToNumber,
    selectBuySwitch,
    selectSellSum,
    writeQuantity
} from "../../utils/RevolutUtils";
import {postBuyProcess} from "./buy/PostBuyProcess";


const BuyClicker = inject("buyState", "sellState", "indicatorReadState")(
    observer(({buyState, sellState, indicatorReadState}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                buyState.localInterval = setTimeout(executeWithInterval, 5000);
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
            if (root.run ) {
                await doBuy();
            }
        }

        let trendBuffer = 0;

        const doBuy = async () => {
            let tradePare = buyState.getCurrentTradePare();
            if (indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            buyState.tryBuyPrices.push(indicatorReadState.lastPriceValue);
            // const isRSIDown = await isRSIDown(tradePare, indicatorReadState.lastRSIValue);
            const correlation = indicatorReadState.parabolicCorrelation;
            // indicatorReadState.buyPointReached;
            // const aroon = indicatorReadState.aroonTrend.split(":");
            // await buyOperation(tradePare, correlation);
            if (indicatorReadState.trailingBuyBot.shouldBuy()
                && correlation > Number(tradePare.aspectCorrelation)
                && indicatorReadState.trendDynamic === "up") {
                   if(trendBuffer > 3){ //15 sec. issilaike
                       await buyOperation(tradePare, correlation);
                       trendBuffer = 0;
                   }
                trendBuffer++;
            }

            if(buyState.countTryBuy > 1200){
                indicatorReadState.dynamicTrendChunkSize = 1
            }
            else if (sellState.countTryBuy > 900){
                indicatorReadState.dynamicTrendChunkSize = 2
            }
            else if (buyState.countTryBuy > 600){
                indicatorReadState.dynamicTrendChunkSize = 3
            }
            else if (buyState.countTryBuy > 300){
                indicatorReadState.dynamicTrendChunkSize = 4
            }
            else {
                indicatorReadState.dynamicTrendChunkSize = indicatorReadState.dynamicTrendChunkSizeDefault;
            }
            buyState.countTryBuy ++;
            buyState.rootStore.saveStorage();
        }

        const buyOperation = async (tradePare, correlation) => {
            let result = await selectBuySwitch();
            if (result === 100) {
                let quantityValue = tradePare.quantity;
                if (quantityValue.includes('%')) {
                    quantityValue = quantityValue.toString()
                    if (quantityValue === '100%') {
                        result += await selectSellSum(100);
                    }
                    if (quantityValue === '75%') {
                        result += await selectSellSum(75);
                    }
                    if (quantityValue === '50%') {
                        result += await selectSellSum(50);
                    }
                    if (quantityValue === '25%') {
                        result += await selectSellSum(25);
                    }
                } else {
                    let quantity = convertToNumber(quantityValue);
                    result += await writeQuantity(quantity);
                }
            }
            if (result === 200) {
               result += await clickBuy(tradePare.key);
               // result += 100;
            }
            if (result === 300) {
                await postBuyProcess(buyState, sellState, indicatorReadState, tradePare, correlation);
            }
            return result;
        }
    }));

export default BuyClicker;


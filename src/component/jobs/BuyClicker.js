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
import {preBuyProcess} from "./buy/PreBuyProcess";

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

        const doBuy = async () => {
            if (indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            let tradePare = buyState.getCurrentTradePare();
            let buyStatus = 0;
            const shouldBy = indicatorReadState.trailingBuyBot.shouldBuy();
            const correlation = indicatorReadState.parabolicCorrelation;
            const trendUp = indicatorReadState.trendDynamic === "up";

            if(shouldBy){
                buyStatus += 100;
            }

            if(correlation){
                buyStatus += 100;
            }

            if(trendUp){
                buyStatus += 100;
            }

            if(buyStatus >= 300){
                await buyOperation(tradePare, correlation);
            } else {
                await preBuyProcess(buyState, indicatorReadState);
            }
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
               //result += await clickBuy(tradePare.key);
               result += 100;
            }
            if (result === 300) {
                await postBuyProcess(buyState, sellState, indicatorReadState, tradePare, correlation);
            }
            return result;
        }
    }));

export default BuyClicker;


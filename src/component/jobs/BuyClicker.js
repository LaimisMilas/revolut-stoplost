import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickBuy,
    convertToNumber,
    getNowDate,
    selectBuySwitch,
    selectSellSum,
    writeQuantity
} from "../../utils/RevolutUtils";
import {isRSIDown} from "../../indicator/RSI14";

const BuyClicker = inject("buyState", "sellState", "indicatorReadState")(
    observer(({buyState,sellState,indicatorReadState}) => {

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
            if (root.run) {
                await doBuy();
            }
        }

        const doBuy = async () => {
            let tradePare = buyState.getCurrentTradePare();
            if(indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            if (await isRSIDown(tradePare, indicatorReadState.lastRSIValue)) {
                const correlation = indicatorReadState.parabolicCorrelation;
                if(correlation > buyState.aspectCorrelation){
                    await buyOperation(tradePare, correlation);
                } else {
                    console.log("BuyClicker doBuy failure correlation: " + correlation);
                }
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
                result += await clickBuy(tradePare.key);
                //result += 100;
                let last100RSIValue = indicatorReadState.last100RSIValue;
                const msg = "BuyClicker clickBuy "
                    + ", lastPriceValue: " + indicatorReadState.lastPriceValue
                    + ", lastRSIValue: " + indicatorReadState.lastRSIValue
                    + ", targetPrice: " + tradePare.targetPrice
                    + ", aspectCorrelation: " + buyState.aspectCorrelation
                    + ", correlation: " + correlation
                    + ", RSI data: " + JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1))
                    + ", time: " + getNowDate();
                buyState.saveMsg(msg);
                console.log(msg);
            }

            if (result === 300) {
                buyState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                sellState.getCurrentTradePare().price = Number(indicatorReadState.lastPriceValue).toFixed(2);
                result += 100;
                sellState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
            }
            console.log("BuyClicker buyOperation " + tradePare.name + " done status: " + result);
            return result;
        }

    }));

export default BuyClicker;


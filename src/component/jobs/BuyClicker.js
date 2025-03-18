import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickBuy,
    convertToNumber,
    getNowDate, isBuyReached, isRSIDown,
    selectBuySwitch,
    selectSellSum,
    writeQuantity
} from "../../utils/RevolutUtils";
import {
    doParabolicCorrelation,
    simpleMovingAverage
} from "../../utils/IndicatorsUtils";

const BuyClicker = inject("buyState", "stopLostState", "indicatorReadState")(
    observer(({buyState, stopLostState,indicatorReadState}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await run();
                let intervalTime = buyState.systemCfg.cfg.linkedInLike.rootTimeout;
                buyState.localInterval = setTimeout(executeWithInterval, intervalTime);
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
            if (await isBuyReached(tradePare, indicatorReadState.lastPriceValue)
                && await isRSIDown(tradePare, indicatorReadState.lastRSIValue)
                && await doRSIParabolicCorrelation() > 0.80) {
                await buyOperation(tradePare);
            }
        }

        const buyOperation = async (tradePare) => {
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
                let last100RSIValue = indicatorReadState.last100RSIValue;
                    console.log("BuyClicker clickBuy "
                    + ", lastPriceValue: " + indicatorReadState.lastPriceValue
                    + ", lastRSIValue: " + indicatorReadState.lastRSIValue
                    + ", targetPrice: " + tradePare.targetPrice
                    + ", RSI corelecijos duomenys: " + JSON.stringify(last100RSIValue.slice(50, indicatorReadState.last100RSIValue.length - 1))
                    + ", time: " + getNowDate());
            }
            if (result === 300) {
                buyState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                stopLostState.getCurrentTradePare().price = indicatorReadState.lastPriceValue;
                result += 100;
                stopLostState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
            }
            console.log("BuyClicker buyOperation " + tradePare.name + " done status: " + result);
            return result;
        }

        const doRSIParabolicCorrelation = async () => {
            let last100RSIValue = indicatorReadState.last100RSIValue;
            last100RSIValue = last100RSIValue.slice(50, indicatorReadState.last100RSIValue.length - 1);
            return doParabolicCorrelation(simpleMovingAverage(last100RSIValue,3), "Buy RSI + parabolic");
        }

    }));

export default BuyClicker;


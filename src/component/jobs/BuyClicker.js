import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickBuy,
    convertToNumber,
    selectBuySwitch,
    selectSellSum,
    writeQuantity
} from "../../utils/RevolutUtils";

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
            if (root.run ) {
                await doBuy();
            }
        }

        const doBuy = async () => {
            let tradePare = buyState.getCurrentTradePare();
            if(indicatorReadState.lastPriceValue === 0 || indicatorReadState.lastRSIValue === 0) {
                return;
            }
            const correlation = indicatorReadState.parabolicCorrelation;
            if (indicatorReadState.buyPointReached && correlation > tradePare.aspectCorrelation && indicatorReadState.trendByPrice1min === "up") {
                await buyOperation(tradePare, correlation);
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
            }

            if (result === 300) {
                buyState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                sellState.getCurrentTradePare().price = Number(indicatorReadState.lastPriceValue).toFixed(2);
                result += 100;
                sellState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
                indicatorReadState.buyPointReached = false;
                indicatorReadState.isTrailingActive = false;
                indicatorReadState.trailingPoint = 0;
                indicatorReadState.deltaValue = 0;
                await saveMsg(tradePare, correlation, "BUY");
            }
            console.log("BuyClicker buyOperation " + tradePare.name + " done status: " + result);
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
            //msg.rsiData = JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1));
            msg.time = Date.now();
            buyState.saveMsg(msg);
        }

    }));

export default BuyClicker;


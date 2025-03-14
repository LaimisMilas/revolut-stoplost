import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickBuy,
    convertToNumber, getRSIIndicator, readLastPrice, selectBuySwitch,
    selectSellSum,
    writeQuantity
} from "../../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";

const BuyClicker = inject("buyState", "stopLostState")(
    observer(({buyState, stopLostState}) => {

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
            let tradePare = buyState.currentTradePare;
            if(await isBuyReached(tradePare) && await isRSIDown(tradePare)){
                await buyOperation(tradePare);
            }
        }

        const buyOperation = async (tradePare) => {
            let result = await selectBuySwitch();
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
            }
            let buyPrice = 0;
            if(result === 200){
                buyPrice =  readLastPrice();
                result += await clickBuy(tradePare.key);
                console.log("BuyClicker clickBuy "
                    + ", readLastPrice: " + buyPrice
                    + ", RSI 14: " + await getRSIIndicator()
                    + ", price: " + tradePare.targetPrice
                    + ", time: " + Date.now());
            }
            if(result === 300){
                buyState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                stopLostState.currentTradePare.price = buyPrice;
                result += 100;
                stopLostState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
            }
            console.log("BuyClicker buyOperation "+ tradePare.name + " done status: " + result);
            return result;
        }

        const isBuyReached = async (tradePare) => {
            let lastPrice = await readLastPrice();
            let buyPrice = convertToNumber(tradePare.targetPrice);
            let isBuyReached = lastPrice <= buyPrice;
            console.log("isBuyReached "
                + ", lastPrice: " + lastPrice
                + ", buyPrice: " + buyPrice
                + ", isBuyReached: " + isBuyReached);
            return isBuyReached;
        }

        const isRSIDown = async (tradePare) => {
            if(Utils.getElByXPath("//iframe")){
                let assetValue = tradePare.rsi;
                let indicatorValue = await getRSIIndicator();
                let isRSIDown = indicatorValue <= convertToNumber(assetValue);
                console.log("BuyClicker isRSIDown "
                    + ", assetValue: " + assetValue
                    + ", indicatorValue: " + indicatorValue
                    + ", isRSIDown: " + isRSIDown);
                return isRSIDown;
            }
            return false;
        }

    }));

export default BuyClicker;


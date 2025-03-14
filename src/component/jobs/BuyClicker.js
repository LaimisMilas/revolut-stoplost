import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {
    clickBuy,
    convertToNumber, getBuyPrice, getRSIIndicator, readLastPrice, selectBuySwitch,
    selectSellSum,
    writeQuantity
} from "../../utils/RevolutUtils";
import {Utils} from "html-evaluate-utils/Utils";

const BuyClicker = inject("buyState", "navigationState", "cfgPanelState",
    "timeOutState", "actorState", "stopLostState")(
    observer(({
                  buyState, navigationState, cfgPanelState,
                  timeOutState, actorState, stopLostState
              }) => {

        let logging = false;
        let logPrefix = " BuyClicker";

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
            let cfg = buyState.systemCfg.cfg.linkedInLike.like;
            let root = buyState.systemCfg.cfg.linkedInLike.root;
            logging = cfg.log;
            if (window.location.href.includes("http://localhost:8083")) {
                logging = true;
                actorState.resetAllInteracted();
            }
            navigationState.syncCurrentPageByWindowLocation();
            if (root.run && navigationState.nav.currentPage === navigationState.pages.feed) {
                let hasActiveTimeOut = timeOutState.hasActiveTimeOut(cfg.key);
                if (!hasActiveTimeOut && buyState.userCfg.cfg.linkedInLike[cfg.key].run) {
                    timeOutState.clearTimeOutsByKey(cfg.key);
                    await doBuy(cfg, callback);
                }
            }
        }

        const isBuyReached = () => {
            let lastPrice = readLastPrice();
            let buyPrice = convertToNumber(buyState.userCfg.cfg.linkedInLike.like.value);
            let isBuyReached = lastPrice <= buyPrice;
            console.log("isBuyReached "
                + ", lastPrice: " + lastPrice
                + ", buyPrice: " + buyPrice
                + ", isBuyReached: " + isBuyReached);
            return isBuyReached;
        }

        const doBuy = async (cfg, callback) => {
            let tradeName = buyState.userCfg.cfg.linkedInLike.repost.value.split("-")[0];
            if(isBuyReached() && await isRSIDown()){
                console.log("Buy Reached do Run BUY");
                const result = await buyOperation(tradeName);
                if(result === 400){
                    callback({key: cfg.key, result: result, parentId: 0, cover: 100});
                }
            }
        }

        const buyOperation = async (tradeName) => {
            let result = await selectBuySwitch();
            if(result === 100){
                let quantityValue = buyState.userCfg.cfg.linkedInLike.subscriber.value;
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
                result += await clickBuy(tradeName);
                console.log("BuyClicker clickBuy "
                    + ", readLastPrice: " + readLastPrice()
                    + ", RSI 14: " + await getRSIIndicator()
                    + ", price: " + buyState.userCfg.cfg.linkedInLike.like.value
                    + ", time: " + new Date().getTime());
            }
            if(result === 300){
                buyState.systemCfg.cfg.linkedInLike.root.run = false;
                result += 100;
                stopLostState.currentTradePare.price = buyPrice;
                result += 100;
                stopLostState.systemCfg.cfg.linkedInLike.root.run = true;
                result += 100;
            }
            console.log("buyOperation done status: " + result);
            return result;
        }

        const isRSIDown = async () => {
            if(Utils.getElByXPath("//iframe")){
                let assetValue = buyState.userCfg.cfg.linkedInLike.follower.value;
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

        const callback = (result) => {
            logging && console.log(logPrefix + " callback result: " + JSON.stringify(result));
            if (result.result) {
                cfgPanelState.updateBadge(result.key, cfgPanelState.badge[result.key] + 1);
            }
        }

    }));

export default BuyClicker;


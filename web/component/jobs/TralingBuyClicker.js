import {inject, observer} from "mobx-react";
import {useEffect} from "react";
const TrailingBuyClicker = inject("buyState", "sellState", "indicatorReadState")(
    observer(({buyState,sellState,indicatorReadState}) => {

        useEffect(() => {
            run().then();
        }, [indicatorReadState.buyPointReached]);

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
            const correlation = indicatorReadState.parabolicCorrelation;
            await buyOperation(tradePare, correlation);
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
                await saveMsg(tradePare, correlation, "BUY");
            }
            return result;
        }

        const saveMsg = async (tradePare,correlation, type) => {
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

export default TrailingBuyClicker;


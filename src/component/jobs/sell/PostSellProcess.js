import {TrailingBuyBot} from "../../../indicator/TrailingBuyBot";

export const postSellProcess = async (buyState, sellState, indicatorReadState, tradePare, correlation, caller) => {
    let result = 0
    sellState.systemCfg.cfg.linkedInLike.root.run = false;
    if (caller === "stopLost") {
        const newTargetPrice = Number(indicatorReadState.lastPriceValue) + ((Number(indicatorReadState.lastPriceValue) * 1) / 100);
        buyState.getCurrentTradePare().targetPrice = Number(newTargetPrice).toFixed(2);
    } else if (caller === "takeProf") {
        buyState.getCurrentTradePare().targetPrice = Number(indicatorReadState.lastPriceValue);
    }
    let rsi = indicatorReadState.lastRSIValue < 40 ? 50 : indicatorReadState.lastRSIValue;
    indicatorReadState.trailingBuyBot = new TrailingBuyBot({trailingActivateRSI: rsi, trailingPercent: 10});
    indicatorReadState.buyPointReached = false;
    indicatorReadState.isTrailingActive = false;
    indicatorReadState.trailingPoint = 0;
    indicatorReadState.deltaValue = 0;
    sellState.getCurrentTradePare().takeProf = 1.2;
    sellState.getCurrentTradePare().aspectCorrelation = -0.5;
    sellState.countTrySell = 0;
    sellState.trySellPrices = [];
    buyState.countTryBuy = 0;
    buyState.tryBuyPrices = [];
    buyState.systemCfg.cfg.linkedInLike.root.run = true;
    await saveMsg(tradePare, correlation, "SELL", sellState, indicatorReadState);
    return result;
}


const saveMsg = async (tradePare, correlation, type, sellState, indicatorReadState) => {
    const msg = {};
    msg.type = type;
    msg.name = tradePare.name;
    msg.price = Number(tradePare.price).toFixed(2);
    msg.stopLost = sellState.getCurrentTradePare().stopLost
    msg.takeProf = sellState.getCurrentTradePare().takeProf;
    msg.quantity = tradePare.quantity;
    msg.lastPriceValue = Number(indicatorReadState.lastPriceValue).toFixed(2);
    msg.lastRSIValue = Number(indicatorReadState.lastRSIValue).toFixed(2);
    msg.aspectCorrelation = sellState.aspectCorrelation;
    msg.correlation = correlation;
    msg.leftLineCorrelation = indicatorReadState.leftLineCorrelation;
    msg.bullishLineCorrelation = indicatorReadState.bullishLineCorrelation;
    msg.bearishLineCorrelation = indicatorReadState.bearishLineCorrelation;
    msg.sinusoidCorrelation = indicatorReadState.sinusoidCorrelation;
    msg.divergence = indicatorReadState.divergence;
    msg.trendByPrice = indicatorReadState.trendByPrice;
    msg.trendByPrice1min = indicatorReadState.trendByPrice1min;
    msg.aroonTrend = indicatorReadState.aroonTrend;
    msg.trailing = indicatorReadState.trailingSellBot.shouldSell();
    //msg.rsiData = JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1));
    msg.time = Date.now();
    sellState.saveMsg(msg);
}
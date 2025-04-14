import {TrailingSellBot} from "../../../indicator/TrailingSellBot";

export const postBuyProcess = async (buyState, sellState, indicatorReadState, tradePare, correlation) => {
    let result = 0;
    buyState.systemCfg.cfg.linkedInLike.root.run = false;
    sellState.getCurrentTradePare().price = Number(indicatorReadState.lastPriceValue).toFixed(2);
    let rsi = indicatorReadState.lastRSIValue > 70 ? 50 : indicatorReadState.lastRSIValue;
    indicatorReadState.trailingSellBot = new TrailingSellBot({trailingActivateRSI: rsi, trailingPercent: 10});
    indicatorReadState.buyPointReached = false;
    indicatorReadState.isTrailingActive = false;
    indicatorReadState.trailingPoint = 0;
    indicatorReadState.deltaValue = 0;
    indicatorReadState.dynamicTrendChunkSizeDefault = 5;
    buyState.countTryBuy = 0;
    buyState.trySellPrices = [];
    sellState.countTrySell = 0;
    sellState.trySellPrices = [];
    sellState.systemCfg.cfg.linkedInLike.root.run = true;
    await saveMsg(tradePare, correlation, "BUY", indicatorReadState, buyState);
    return result;
}

const saveMsg = async (tradePare, correlation, type, indicatorReadState, buyState) => {
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
    msg.trendByPrice = indicatorReadState.trendByPrice;
    msg.trendByPrice1min = indicatorReadState.trendByPrice1min;
    msg.aroonTrend = indicatorReadState.aroonTrend;
    msg.trailing = indicatorReadState.trailingBuyBot.shouldBuy();
    //msg.rsiData = JSON.stringify(last100RSIValue.slice(0, indicatorReadState.last100RSIValue.length - 1));
    msg.time = Date.now();
    buyState.saveMsg(msg);
}
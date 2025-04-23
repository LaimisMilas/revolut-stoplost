import {convertToNumber} from "../../../utils/RevolutUtils";

export const preSellProcess = async (buyState, sellState, indicatorReadState, tradePare) => {

    //applyDiscount(sellState);

    //trendRegulator(sellState, indicatorReadState);

    sellState.countTrySell++;
    sellState.rootStore.saveStorage();
}

function applyDiscount(sellState){
    if(sellState.countTrySell > 600){
        discountTP(0.0001, sellState);
    }
    else if (sellState.countTrySell > 500){
        discountTP(0.0001, sellState);
    }
    else if (sellState.countTrySell > 300){
        discountTP(0.0001, sellState);
    }
    else if (sellState.countTrySell > 200){
        discountTP(0.0001, sellState);
    }
}

function trendRegulator(sellState, indicatorReadState){
    if(sellState.countTrySell > 1200){
        indicatorReadState.dynamicTrendChunkSize = 1
    }
    else if (sellState.countTrySell > 900){
        indicatorReadState.dynamicTrendChunkSize = 2
    }
    else if (sellState.countTrySell > 600){
        indicatorReadState.dynamicTrendChunkSize = 3
    }
    else if (sellState.countTrySell > 300){
        indicatorReadState.dynamicTrendChunkSize = 4
    }
    else {
        indicatorReadState.dynamicTrendChunkSize = indicatorReadState.dynamicTrendChunkSizeDefault;
    }

}
function discountTP(discount, sellState) {
    sellState.getCurrentTradePare().takeProf = sellState.getCurrentTradePare().takeProf - discount;
}

export const isTakeProfReached = (tradePare, indicatorReadState) => {
    let lastPrice = indicatorReadState.lastPriceValue;
    if(lastPrice <= 0){
        return false;
    }
    let buyPrice = convertToNumber(tradePare.price);
    let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
    return currentProfit > convertToNumber(tradePare.takeProf);
}

export const takeProfDiff = (tradePare, indicatorReadState) => {
    let lastPrice = indicatorReadState.lastPriceValue;
    if(lastPrice <= 0){
        return 0;
    }
    let buyPrice = convertToNumber(tradePare.price);
    let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
    return  currentProfit - convertToNumber(tradePare.takeProf);
}

export const isStopLostReached = (tradePare, indicatorReadState) => {
    let lastPrice = indicatorReadState.lastPriceValue;
    if(lastPrice <= 0){
        return false;
    }
    let buyPrice = convertToNumber(tradePare.price);
    let currentProfit = ((lastPrice * 100)/buyPrice) - 100;
    return currentProfit < convertToNumber(tradePare.stopLost);
}
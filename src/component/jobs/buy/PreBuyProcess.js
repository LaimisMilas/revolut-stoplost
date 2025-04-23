export const preBuyProcess = async (buyState, indicatorReadState) => {

    //trendRegulator(buyState, indicatorReadState);

    buyState.countTryBuy++;
    buyState.rootStore.saveStorage();
}

function trendRegulator(buyState, indicatorReadState){
    if(buyState.countTryBuy > 1200){
        indicatorReadState.dynamicTrendChunkSize = 1
    }
    else if (buyState.countTryBuy > 900){
        indicatorReadState.dynamicTrendChunkSize = 2
    }
    else if (buyState.countTryBuy > 600){
        indicatorReadState.dynamicTrendChunkSize = 3
    }
    else if (buyState.countTryBuy > 300){
        indicatorReadState.dynamicTrendChunkSize = 4
    }
    else {
        indicatorReadState.dynamicTrendChunkSize = indicatorReadState.dynamicTrendChunkSizeDefault;
    }
}
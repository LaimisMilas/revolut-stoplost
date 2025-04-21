import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "./state/RootStore";
import SellClicker from "./component/jobs/SellClicker";
import BuyClicker from "./component/jobs/BuyClicker";
import DataReader from "./component/jobs/DataReader";
import SellPanel from "./component/ui/SellPanel";
import BuyPanel from "./component/ui/BuyPanel";
import OrderList from "../web/component/ui/OrderList";
import CandleAnalyzerPanel from "../web/component/ui/CandleAnalyzePanel";
import CandleController from "./component/controller/CandleController";
import IndicatorController from "./component/controller/IndicatorController";
import TickerController from "./component/controller/TickerController";

const rootState = new RootStore();

const App = () => {
    return (
        <Provider
            rootState={rootState}
            sellState={rootState.sellState}
            buyState={rootState.buyState}
            sellPanelState={rootState.sellPanelState}
            buyPanelState={rootState.buyPanelState}
            indicatorReadState={rootState.indicatorReadState}
            indicatorState={rootState.indicatorState}
            trailingService={rootState.trailingService}
            tickerService={rootState.tickerService}
            candleService={rootState.candleService}
        >
            <div className="App">
                <SellPanel/>
                <BuyPanel/>
                <SellClicker/>
                <BuyClicker/>
                <DataReader/>
                <OrderList/>
                <CandleAnalyzerPanel/>
                <CandleController/>
                <IndicatorController/>
                <TickerController/>
            </div>
        </Provider>
    );
}

export default App;
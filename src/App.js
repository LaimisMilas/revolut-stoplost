import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "./state/RootStore";
import SellClicker from "./component/jobs/SellClicker";
import BuyClicker from "./component/jobs/BuyClicker";
import DataReader from "./component/jobs/DataReader";
import SellPanel from "./component/ui/SellPanel";
import BuyPanel from "./component/ui/BuyPanel";
import TrailingBuy from "../web/component/ui/TrailingBuy";
import OrderList from "../web/component/ui/OrderList";

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
            trailingService={rootState.trailingService}
            tickerService={rootState.tickerService}
        >
            <div className="App">
                <SellPanel/>
                <BuyPanel/>
                <SellClicker/>
                <BuyClicker/>
                <DataReader/>
                <TrailingBuy/>
                <OrderList/>
            </div>
        </Provider>
    );
}

export default App;
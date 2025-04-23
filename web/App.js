import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "../src/state/RootStore";
import SellPanel from "../src/component/ui/SellPanel";
import BuyPanel from "../src/component/ui/BuyPanel";
import TestSellClicker from "./component/jobs/TestSellClicker";
import TestBuyClicker from "./component/jobs/TestBuyClicker";
import OrderList from "./component/ui/OrderList";
import FakeDataReader from "./component/jobs/FakeDataReader";
import TrailingBuyBotPanel from "./component/ui/TrailingBuyBotPanel";
import {LocalStorageManager} from "../src/storage/LocalStorageManager";
import IndicatorsPanel from "./component/ui/IndicatorsPanel";

//LocalStorageManager.flash("rc_store_state", 0);
const rootState = new RootStore("rc_");

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
            <div className="webApp">
                <SellPanel/>
                <BuyPanel/>
                <TestSellClicker/>
                <TestBuyClicker/>
                <FakeDataReader/>
                <OrderList/>
                <TrailingBuyBotPanel/>
                <IndicatorsPanel/>
            </div>
        </Provider>
    );
}

export default App;
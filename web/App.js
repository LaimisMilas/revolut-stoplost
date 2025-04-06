import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "../src/state/RootStore";
import SellPanel from "../src/component/ui/SellPanel";
import BuyPanel from "../src/component/ui/BuyPanel";
import SellClicker from "./component/jobs/SellClicker";
import BuyClicker from "./component/jobs/BuyClicker";
import OrderList from "./component/ui/OrderList";
import FaceDataReader from "./component/jobs/FaceDataReader";
import TrailingBuyBotPanel from "./component/ui/TrailingBuyBotPanel";

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
                <SellClicker/>
                <BuyClicker/>
                <FaceDataReader/>
                <OrderList/>
                <TrailingBuyBotPanel/>
            </div>
        </Provider>
    );
}

export default App;
import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "../src/state/RootStore";
import DataReader from "./component/jobs/DataReader";
import SellPanel from "../src/component/ui/SellPanel";
import BuyPanel from "../src/component/ui/BuyPanel";
import SellClicker from "./component/jobs/SellClicker";
import BuyClicker from "./component/jobs/BuyClicker";
import OrderList from "./component/ui/OrderList";
import ChartPanel from "../src/component/ui/ChartPanel";
import TrailingBuy from "./component/ui/TrailingBuy";
import CryptoAI from "./component/ui/CryptoAI";
import FaceDataReader from "./component/jobs/FaceDataReader";

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
        >
            <div className="webApp">
                <SellPanel/>
                <BuyPanel/>
                <SellClicker/>
                <BuyClicker/>
                <FaceDataReader/>
                <ChartPanel/>
                <OrderList/>
                <TrailingBuy/>
            </div>
        </Provider>
    );
}

export default App;
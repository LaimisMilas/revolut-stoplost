import React from 'react';
import {Provider} from "mobx-react";
import SellPanel from "./component/ui/SellPanel";
import {RootStore} from "./state/RootStore";
import SellClicker from "./component/jobs/SellClicker";
import BuyPanel from "./component/ui/BuyPanel";
import BuyClicker from "./component/jobs/BuyClicker";
import ChartPanel from "./component/ui/ChartPanel";
import DataReader from "./component/jobs/DataReader";

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
        >
            <div className="App">
                <SellPanel/>
                <BuyPanel/>
                <ChartPanel/>
                <SellClicker/>
                <BuyClicker/>
                <DataReader/>
            </div>
        </Provider>
    );
}

export default App;
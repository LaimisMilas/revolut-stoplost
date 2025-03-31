import React from 'react';
import {Provider} from "mobx-react";

import {RootStore} from "./state/RootStore";
import SellClicker from "./component/jobs/SellClicker";

import BuyClicker from "./component/jobs/BuyClicker";
import DataReader from "./component/jobs/DataReader";

import SellPanel from "./component/ui/SellPanel";
import BuyPanel from "./component/ui/BuyPanel";

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
                <SellClicker/>
                <BuyClicker/>
                <DataReader/>
            </div>
        </Provider>
    );
}

export default App;
import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "../src/state/RootStore";
import DataReader from "./component/jobs/DataReader";
import CryptoAI from "./component/ui/CryptoAI";

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
            <div className="App">
                <DataReader/>
                <CryptoAI/>
            </div>
        </Provider>
    );
}

export default App;
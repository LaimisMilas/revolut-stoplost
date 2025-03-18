import React from 'react';
import {Provider} from "mobx-react";
import StopLostPanel from "./component/ui/StopLostPanel";
import {RootStore} from "./state/RootStore";
import StopLostClicker from "./component/jobs/StopLostClicker";
import BuyPanel from "./component/ui/BuyPanel";
import BuyClicker from "./component/jobs/BuyClicker";
import ChartPanel from "./component/ui/ChartPanel";
import ParabolicChartPanel from "./component/ui/ParabolicChartPanel";

const rootState = new RootStore();

const App = () => {

    return (
        <Provider
            rootState={rootState}
            stopLostState={rootState.stopLostState}
            buyState={rootState.buyState}
            cfgPanelState={rootState.cfgPanelState}
            cfgBuyPanelState={rootState.cfgBuyPanelState}
            indicatorReadState={rootState.indicatorReadState}
        >
            <div className="App">
                <StopLostPanel/>
                <BuyPanel/>
                <ChartPanel/>
                <ParabolicChartPanel/>
                <StopLostClicker/>
                <BuyClicker/>
            </div>
        </Provider>
    );
}

export default App;
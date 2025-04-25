import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "./state/RootStore";
import CandleController from "./component/controller/CandleController";
import IndicatorController from "./component/controller/IndicatorController";
import TickerController from "./component/controller/TickerController";
import TickerResaver from "./component/jobs/TickerResaver";
import TradeClicker from "./component/ui/TradeClicker";
import IndicatorsPanel from "../web/component/ui/IndicatorsPanel";

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
                <TickerResaver/>
                <TickerController/>
                <CandleController/>
                <IndicatorController/>
                <TradeClicker/>
                <IndicatorsPanel/>
            </div>
        </Provider>
    );
}

export default App;
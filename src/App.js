import React from 'react';
import {Provider} from "mobx-react";
import StopLostPanel from "./component/ui/StopLostPanel";
import {RootStore} from "./state/RootStore";
import StopLostClicker from "./component/jobs/StopLostClicker";
import BuyPanel from "./component/ui/BuyPanel";
import BuyClicker from "./component/jobs/BuyClicker";

const rootState = new RootStore();

const App = () => {

    return (
        <Provider
            rootState={rootState}
            navigationState={rootState.navigationState} 
            scrollState={rootState.scrollState}
            stopLostState={rootState.stopLostState}
            buyState={rootState.buyState}
            cfgPanelState={rootState.cfgPanelState}
            cfgBuyPanelState={rootState.cfgBuyPanelState}
            ruleState={rootState.ruleState}
            authState={rootState.authState}
            actorState={rootState.actorState}
            timeOutState={rootState.timeOutState}
        >
            <div className="App">
                <StopLostPanel/>
                <BuyPanel/>
                <StopLostClicker/>
                <BuyClicker/>
            </div>
        </Provider>
    );
}

export default App;
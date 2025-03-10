import React from 'react';
import {Provider} from "mobx-react";
import CfgPanel from "./component/ui/CfgPanel";
import {RootStore} from "./state/RootStore";
import StopLostClicker from "./component/jobs/StopLostClicker";

const rootState = new RootStore();

const App = () => {

    return (
        <Provider
            rootState={rootState}
            navigationState={rootState.navigationState} 
            scrollState={rootState.scrollState}
            cfgState={rootState.cfgState}
            cfgPanelState={rootState.cfgPanelState}
            ruleState={rootState.ruleState}
            authState={rootState.authState}
            actorState={rootState.actorState}
            timeOutState={rootState.timeOutState}
        >
            <div className="App">
                <CfgPanel/>
                <StopLostClicker/>
            </div>
        </Provider>
    );
}

export default App;
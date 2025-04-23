import React from 'react';
import {Provider} from "mobx-react";
import {RootStore} from "../src/state/RootStore";
import ReLoginClicker from "./component/jobs/ReLoginClicker";
import ReLogin from "./component/ui/ReLogin";

const rootState = new RootStore("lgc_");

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
                <ReLogin/>
                <ReLoginClicker/>
            </div>
        </Provider>
    );
}

export default App;
import React from 'react';
import {Provider} from "mobx-react";
import CfgPanel from "./component/ui/CfgPanel";
import {RootStore} from "./state/RootStore";
import ConnectClicker from "./component/jobs/ConnectClicker";
import FollowClicker from "./component/jobs/FollowClicker";
import LikeClicker from "./component/jobs/LikeClicker";
import Scroll from "./component/jobs/Scroll";
import SiteNavigation from "./component/jobs/SiteNavigation";
import NewPostClicker from "./component/jobs/NewPostClicker";
import LinkedInLike from "./component/jobs/LinkedInLike";
import AcceptClicker from "./component/jobs/AcceptClicker";
import RepostClicker from "./component/jobs/RePostClicker";

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
                <Scroll/>
                <RepostClicker/>
                <LikeClicker/>
                <NewPostClicker/>
                <LinkedInLike/>
                <ConnectClicker/>
                <FollowClicker/>
                <AcceptClicker/>
            </div>
        </Provider>
    );
}

export default App;
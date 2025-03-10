import {makeAutoObservable} from 'mobx';
import {TimeoutStatus} from "../utils/CustomTimeout";
import {lc_user_cfg} from "../static/lc_user_cfg";
import {lc_system_cfg} from "../static/lc_system_cfg";
import axios from "axios";
import {API_URL, CFG_BY_USER_ID, SAVE_CFG} from "clicker-common/src/Config";
import {DEV_MODE} from "./Config";

export class CfgState {

    rootStore = null;
    authState = null;
    cfgPanelState = null;
    userCfg = null;
    systemCfg = null;
    stopAllAction = false;
    currentTimeOut = {status: TimeoutStatus.COMPLETED};
    intervalGetCfg = null;
    intervalGetSystemCfg = null;
    resetLike = 0;
    resetRePost = 0;
    localInterval;
    rePostInterval;
    intervalGetCfgTimeOut = 11100;
    intervalGetSystemCfgTimeOut = 12200;
    updateSystemCfg = true;
    ///(?=.*like)(?=[\s\S]*1542)/

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore, authState, cfgPanelState) {
        this.rootStore = rootStore;
        this.authState = authState;
        this.cfgPanelState = cfgPanelState;
        this.setUserCfg(lc_user_cfg);
        this.setSystemCfg(lc_system_cfg);
        this.loadSystemCfgPublic();
        this.setIntervalGetCfg();
        this.setIntervalGetSystemCfg();
    }

    setIntervalGetCfg(){
        this.intervalGetCfg = setInterval(
            this.loadFromServiceByUserId.bind(this),
            this.intervalGetCfgTimeOut,
            this.authState.user.uid,
            "CfgState.setIntervalGetCfg()");
    }

    setIntervalGetSystemCfg(){
        this.intervalGetSystemCfg = setInterval(
            this.loadSystemCfgPublic.bind(this),
            this.intervalGetSystemCfgTimeOut,
            this.authState.systemUser,
            "CfgState.setIntervalGetSystemCfg()");
    }

    setUserCfg(rootCfg){
        this.userCfg = rootCfg;
    }

    setRunEntityCfg(key, value){
        this.userCfg.cfg.linkedInLike[key].run = value;
    }

    setSystemCfg(systemCfg){
        this.systemCfg = systemCfg;
    }

    save(updatedCfg, uid, caller) {
        const endPointUrl = DEV_MODE ? API_URL : SAVE_CFG;
        if(uid && uid !== 0){
            axios.post(
                endPointUrl + "saveCfg?uid=" + uid,
                {
                    "cfg": updatedCfg,
                    "uid": uid
                },
                {headers: this.authState.authHeader(" CfgState.save() <-" + caller)})
                .then(response => {
                    this.saveResponse(response);
                }).catch(reason => {
                console.error(reason);
            });
        }
    }

    saveResponse(response){
        if (response.status === 200 && response.data && response.data) {
            if(typeof (response.data) === 'string'){
                response.data = JSON.parse(response.data);
            }
            if(response.data.uid === this.authState.systemUser){
                this.setSystemCfg({
                    "uid" : response.data.uid,
                    "cfg" : response.data.cfg,
                }, " CfgState.save(), response status = 200");
            } else {
                this.setUserCfg({
                    "uid" : response.data.uid,
                    "cfg" : response.data.cfg,
                }, " CfgState.save(), response status = 200");
            }
        } else {
            console.error("status:" + response.status + ", data:" + response.data);
        }
    }

    loadFromServiceByUserId(uid, caller) {
        if (window.location.href.includes("/localhost")) {
            return;
        }
        const endPointUrl = DEV_MODE ? API_URL : CFG_BY_USER_ID;
        if(this.updateSystemCfg && this.authState.user && this.authState.user.uid !== 0 && this.systemCfg.cfg.linkedInLike.root.run){
            axios
                .get(endPointUrl + "cfgByUserId?uid=" + this.authState.user.uid,
                    {headers: this.authState.authHeader(" CfgState.loadFromServiceByUserId() <-" + caller)})
                .then((response) => {
                    this.saveResponse(response);
                })
                .catch(reason => {
                    console.error(reason);
                });
        }
    }

    loadSystemCfgPublic() {
        if (window.location.href.includes("/localhost")) {
            return;
        }
        const endPointUrl = DEV_MODE ? API_URL : "https://clicker-system-cfg.web.app/lc_systemCfg.json";
        if(this.systemCfg.cfg.linkedInLike.root.run){
            axios
                .get(endPointUrl)
                .then((response) => {
                    this.saveResponse(response);
                })
                .catch(reason => {
                    console.error(reason);
                });
        }
    }
}

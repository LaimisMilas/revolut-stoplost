import {makeAutoObservable} from 'mobx';
import {getTime} from "html-evaluate-utils/DateFormat";
import {lc_user} from "clicker-common/src/staticData/lc_user";
import {DEV_MODE} from "./Config";
import {API_URL, CFG_BY_USER_ID} from "clicker-common/src/Config";
import axios from "axios";

export class AuthState {

    user = lc_user;
    systemUser = "aiI1EpdmPUV1vhEUH232Wn5AVxu1";
    lsUserKey = "lc_user";
    intervalGetUser = null;
    intervalGetUserTimeOut = 2000;
    serverToken = null;

    constructor() {
        makeAutoObservable(this);
    }

    setup(caller) {
        this.user = lc_user;
        this.addEventListener(" AuthState.setup() <-" + caller)
        this.setIntervalGetAuth(" AuthState.setup() <-" + caller);
    }

    getUser(caller) {
        return this.user;
    }

    setUser(user){
        this.user = user;
    }

    logOut(caller){
        this.resetUserLocalData("AuthState.logOut() <-" + caller);
        this.user = lc_user;
    }

    saveToLocalStore() {
        localStorage.setItem(this.lsUserKey, JSON.stringify(this.user));
    }

    readFromLocalStore(caller){
        if (localStorage.getItem(this.lsUserKey)) {
            this.setUser(JSON.parse(localStorage.getItem(this.lsUserKey)), caller);
        }
    }

    resetUserLocalData(caller){
        localStorage.removeItem(this.lsUserKey);
        this.setUser(lc_user);
    }

    authHeader(caller) {
        if(this.serverToken && typeof this.serverToken === 'string' && this.serverToken.length > 0) {
            return { Authorization: 'Bearer ' + this.serverToken};
        } else {
            this.setUser(lc_user);
            return {};
        }
    }

    initGetAuthToken(){
        window.postMessage({
            type: 'lc_get_auth_token'
        }, '*');
    }

    addEventListener(){
        window.addEventListener('message', this.authResponse.bind(this));
    }

    async authResponse(event) {
        if (event.data.type === 'lc_auth_token_response') {
            if( this.serverToken !== event.data.response || this.user.uid === 0){
                this.serverToken = event.data.response;
                this.loginToServerSide(" AuthState.authResponse()");
                this.saveToLocalStore(" AuthState.authResponse()");
            }
        }
    }

    setIntervalGetAuth(caller){
        this.intervalGetUser = setInterval(
            this.initGetAuthToken.bind(this),
            this.intervalGetUserTimeOut,
            "AuthState.setIntervalGetAuth()");
    }

    loginToServerSide(caller) {
        const endPointUrl = DEV_MODE ? API_URL : "https://validatetoken-mbt63joypq-uc.a.run.app";
        if(this.serverToken && typeof this.serverToken === 'string'){
            axios
                .get(endPointUrl,
                    {headers: this.authHeader(" AuthState.loginToServerSide() <-" + caller)})
                .then((response) => {
                    if (response.status === 200 && response.data && response.data) {
                        this.setUser(response.data);
                    } else {
                        console.error("status:" + response.status + ", data:" + response.data);
                    }
                })
                .catch(reason => {
                    console.error(reason);
                });
        }
    }
}

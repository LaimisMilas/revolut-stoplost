import {makeAutoObservable} from 'mobx';
import {TimeoutStatus} from "../utils/CustomTimeout";
import {lc_element_xpath, lc_nav_cfg, lc_nav_pages} from "../static/lc_nav_cfg";
import {DEV_MODE} from "./Config";
import {API_URL} from "clicker-common/src/Config";
import axios from "axios";
import {Utils} from "html-evaluate-utils/Utils";

export class NavigationState {

    rootStore = null;
    nav = null;
    pages = null;
    stopAllAction = false;
    currentTimeOut = {status: TimeoutStatus.COMPLETED};
    elementXPath = null;
    intervalGetNavCfgTimeOut = 11100;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
        this.pages = lc_nav_pages;
        this.elementXPath = lc_element_xpath;
        this.nav = lc_nav_cfg;
        this.intervalGetNavCfgTimeOut = lc_nav_cfg.rootTimeout;
        this.syncCurrentPageByWindowLocation();
        this.setIntervalGetNavCfg();
    }

    setIntervalGetNavCfg(){
        this.intervalGetCfg = setInterval(
            this.loadNavCfgPublic.bind(this),
            this.intervalGetNavCfgTimeOut);
    }

    // Metodas paga duota rakta suranda cfg objekta
// ** @param {String} key cfg objekto raktas    
    getByKeyNavCfg(key) {
        let newArray = this.nav.pages.filter(function (el) {
                return el.key === key;
            }
        );
        return newArray[0];
    }

    // Metodas grazina cfg objekta, kuris turi currentPage = true
    // tai yra aktyvu langa
    getCurrentPageNavCfg (){
        let newArray = this.nav.pages.filter(function (el) {
                return el.currentPage;
            }
        );
        return newArray[0];
    }

    getNextCurrentPageNavCfg(navCfg){
        let next = this.getByKeyNavCfg(navCfg.nextPageKey);
        if (!next.run) {
            next = this.getNextCurrentPageNavCfg(next);
        }
        return next;
    }

    syncCurrentPageByWindowLocation() {
        this.nav.pages.filter(function (el) {
                el.currentPage = window.location.href.includes(el.key);
                if(el.currentPage){
                    this.nav.currentPage = el.key;
                }
            }.bind(this)
        );
    }

    changePath(currentPageViewCfg){
        if(!currentPageViewCfg.run){
            return;
        }
        let nextPageViewCfg = this[0].getNextCurrentPageNavCfg(currentPageViewCfg);
        let buttonToClick = Utils.getElByXPath(nextPageViewCfg.xPath);
        if (buttonToClick) {
            buttonToClick.click();
            setTimeout(function () {
                if (window.location.href.includes(nextPageViewCfg.path)) {
                    this[1].resetAllTimeOuts();
                    this[0].nav.currentPage = nextPageViewCfg.key;
                    currentPageViewCfg.currentPage = false;
                    nextPageViewCfg.currentPage = true;
                }
            }.bind(this[0]), 2000);
        }
    }

    saveResponse(response){
        if (response.status === 200 && response.data && response.data) {

            if(typeof (response.data) === 'string'){
                response.data = JSON.parse(response.data);
            }
            this.pages = response.data.lc_nav_pages;
            this.elementXPath = response.data.lc_element_xpath;
            this.nav = response.data.lc_nav_cfg;

        } else {
            console.error("status:" + response.status + ", data:" + response.data);
        }
    }

    loadNavCfgPublic() {
        if (window.location.href.includes("/localhost")) {
            return;
        }
        const endPointUrl = DEV_MODE ? API_URL : "https://clicker-system-cfg.web.app/lc_nav_cfg.json";
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

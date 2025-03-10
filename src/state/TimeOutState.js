import {makeAutoObservable} from "mobx";
import {TimeoutStatus} from "../utils/CustomTimeout";

export class TimeOutState {

    timeOuts = new Map();

    constructor() {
        makeAutoObservable(this);
    }

    setup(caller) {

    }

    hasActiveTimeOut = (key) => {
        let result = false;
        if (this.timeOuts.has(key)) {
            this.timeOuts.get(key).forEach((customTimeout) => {
                if (customTimeout.status !== TimeoutStatus.COMPLETED) {
                    result = true;
                }
            });
        }
        return result;
    }

    clearTimeOutsByKey = (key) => {
        if (this.timeOuts.has(key)) {
            this.timeOuts.get(key).forEach((customTimeout) => {
                customTimeout.cancel();
            });
            this.timeOuts.get(key).clear();
        }
    }

    resetAllTimeOuts = () => {
        if (this.timeOuts && this.timeOuts.size > 0) {
            this.timeOuts.forEach((value) => {
                value.forEach((customTimeout) => {
                    customTimeout.cancel();
                });
            });
            this.timeOuts.clear();
        }
    }

    saveTimeOut = (customTimeout, key) => {
        if (typeof (key) === 'string') {
            if (this.timeOuts.has(key)) { //push then exist, is array value by key
                this.timeOuts.get(key).push(customTimeout);
            } else { // new one then not exist, set new Array by key
                this.timeOuts.set(key, [customTimeout]);
            }
        } else {
            console.log("key: " + key);
        }
    }

}
import {Utils} from "html-evaluate-utils/Utils";

export const TimeoutStatus = {
    PENDING: "pending",
    RUNNING: "running",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
};
export class CustomTimeout {
    
    constructor(callback, delay, ...args) {
        this.executeTime = null;
        this.startTime = new Date();
        this.status = TimeoutStatus.PENDING;
        this.delay = delay;
        this.cfg = args[0];
        this.timeoutId = setTimeout(() => {
            this.status = TimeoutStatus.RUNNING;
            callback(...args, this.timeoutId);
            this.status = TimeoutStatus.COMPLETED;
            this.executeTime = new Date() - this.startTime;
        }, delay);
    }


    cancel() {
        clearTimeout(this.timeoutId);
        if (this.status !== TimeoutStatus.COMPLETED) {
            this.status = TimeoutStatus.CANCELLED;
        }
    }

    getElapsedTime() {
        return new Date() - this.startTime;
    }
    
    triggerAfter() {
        return this.delay -(new Date() - this.startTime); 
    }
}

export const getTimeoutTime = (timeOutBefore,  cfg) => {
    let newTimeOut =  Utils.getRandomValue(cfg.range);
    if(newTimeOut > timeOutBefore){
        newTimeOut = timeOutBefore + (newTimeOut - timeOutBefore);
    } else {
        newTimeOut = timeOutBefore + Utils.getRandomValue(cfg.range);
    }
    return newTimeOut;
}

/**
const myTimeout = new CustomTimeout(() => {
    console.log("Timeout completed!");
    //my code here
}, 5000);

console.log("Timeout status:", myTimeout.status);
console.log("Elapsed time:", myTimeout.getElapsedTime());

// Jei norite atšaukti timeout:
// myTimeout.cancel();
 */
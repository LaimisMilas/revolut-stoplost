import {Utils} from "html-evaluate-utils/Utils";

export const click = (element) => {
    let result = false;
    try {
        if (element) {
            element.focus();
            element.click();
            result = true;
        }
    } catch (e) {
        console.log(e.stack);
    }
    return result;
}
// copy from one element to another
export const copyPaste = (copyFromEl, pasteToEl) => {
    let result = false;
    try {
        let copyFromEl = Utils.getElByXPath(copyFromEl);
        let copyToEl = Utils.getElByXPath(pasteToEl);
        
        if (copyFromEl && copyToEl) {
            copyToEl.value = copyFromEl.value;
            result = true;
        }
    } catch (e) {
        console.log(e.stack);
    }
    return result;
}

/**
let cfg = {
    run: true,
    steps: [
        {
            event: "click",
            elXPath: "//",
            timeOut: 1000
        },
        {
            event: "copyPast",
            elXPath: "",
            timeOut: 1000,
            copyFromEl: "//",
            pasteToEl: "//"
        }
    ]
}
**/
export const runSteps = (cfg) => {
    if (cfg.run) {
        cfg.steps.forEach(v => {
            if (v.event === "click") {
                let element = Utils.getElByXPath(v.elXPath);
                setTimeout(click.bind(this), v.timeOut, element);
            }
            if (v.event === "copyPast") {
                setTimeout(copyPaste.bind(this), v.timeOut, v.copyFromEl, v.pasteToEl);
            }
        })
    }
}
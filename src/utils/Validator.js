import {Utils} from "html-evaluate-utils/Utils";

/** @param {Object} buttonToClick - DOM elementas.
 cfg:{
 validateElXPath: "/span\/*\/*",
 validateValue: "svg"
 }
 * @param cfg
 */
export const validate = (buttonToClick, cfg) => {
    let result = false;
    if (cfg.validate) {
        //TODO gal naudoti Utils.isElementPresent() metoda.
        let nXpath = Utils.getXPathByEl(buttonToClick);
        nXpath = nXpath + cfg.validateElXPath;
        let elementExist = Utils.getElByXPath(nXpath);
        if (elementExist) {
            if (isNodeNameValid(elementExist, cfg.validateValue)) {
                result = true;
            }
        }
    } else {
        result = true;
    }
    return result;
}

const isNodeNameValid = (element, nodeType) => {
    return element.nodeName === nodeType;
}

const isNodeValueValid = (element, text) => {
    return element.textContext === text;
}
    
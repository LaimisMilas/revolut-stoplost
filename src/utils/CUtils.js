import {Utils} from "html-evaluate-utils/Utils";

export const isOnIgnoreList = (element, cfg, actorState) => {
    return actorState.isNameOnIgnoreList(element, cfg);
}

export const isOnFriendList = (element, cfg, actorState) => {
    return actorState.isNameOnFriendList(element, cfg);
}

export const directAutoClick = (element, cfg, callback) => {
    if (autoClick(element)) {
        callback({key: cfg.key, result: true, parentId: 0, cover: 100});
    }
}

export const  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const retrieveElementByRule = (cfg, container, ruleState, actorState) => {
    let resultElement;
    let rule = ruleState.findCurrentRuleSetByKey(cfg.key);
    if (rule && container) {
        let path = cfg.paths[rule.ruleTarget];
        let href = actorState.getActorHref(container, cfg, "");
        if (path && href && href.includes("company")) {
            path = cfg.paths.name;
        }
        if (path){
            resultElement = Utils.getElByXPath(container + path);
        }
        if (!resultElement && cfg.key === "connector" && cfg.paths["description2"]) {
            resultElement = Utils.getElByXPath(container + cfg.paths["description2"]);
        }
        if (!resultElement && cfg.key === "follower" && cfg.paths["description2"]) {
            resultElement = Utils.getElByXPath(container + cfg.paths["description2"]);
        }
    }
    return resultElement;
}

export const retrieveElementForLikeByRule = (cfg, container, ruleState, actorState) => {
    let resultElement;
    let rule = ruleState.findCurrentRuleSetByKey(cfg.key);
    if(rule){
        let path = cfg.paths[rule.ruleTarget];
        let href = actorState.getActorHref(container, cfg);
        if(href && href.includes("company")){
            path =  cfg.paths.name;
        }
        resultElement = Utils.getElByXPath(container + path);

        if(!resultElement){
            resultElement = Utils.getElByXPath(container + "/../../../..//div[contains(@class, 'update-components-actor')]/div/a");
        }
    }
    return resultElement;
}

export const isTextValidForWitAi = (elHoldText, interacted) => {
    let result = false;
    if (elHoldText && elHoldText.innerText.length > 0) {
        let textToWit = elHoldText.innerText.substring(0, 280);
        if (isInteracted(textToWit, interacted)) {
            result = true;
        }
    }
    return result;
}

export const isInteracted = (textToWit, interacted) => {
    return interacted && !interacted.includes(textToWit);
}

export const witMessageCallBack = (xhttp, element, cfg, callback, ruleState) => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        let responseIntent = JSON.parse(xhttp.responseText).intents[0];
        if (responseIntent) {
            if (cfg.wit.run && cfg.wit.ruleSet) {
                witResponseApplyRule(element, cfg, responseIntent, callback, ruleState);
            } else {
                witResponseAutoClick(element, cfg, responseIntent, callback);
            }
        }
    }
}

export const witResponseApplyRule = (element, cfg, responseIntent, callback, ruleState) => {
    let rule = ruleState.findCurrentRuleSetByKey(cfg.key, responseIntent);
    if (rule) {
        if (responseIntent && rule.ruleIntent === responseIntent.name) {
            witResponseAutoClick(element, cfg, responseIntent, rule, callback);
        }
    }
}

export const witResponseAutoClick = (element, cfg, responseIntent, rule, callback) => {
    if (responseIntent && responseIntent.confidence >= rule.confidence) {
        let clickResult = false;
        if(cfg.key === "repost"){
            autoRePost(element, responseIntent, callback);
        }else {
            if (autoClick(element)) {
                clickResult = true;
            }
        }
        callback({key: cfg.key, result: clickResult, parentId: 0, cover: 100});
    }
}

export const autoClick = (buttonToClick) => {
    let result = false;
    try {
        if (buttonToClick) {
            buttonToClick.focus();
            buttonToClick.click();
            result = true;
        }
    } catch (e) {
        console.log(e.stack);
    }
    return result;
}

export const autoRePost = (likeButton, responseIntent, callback) => {
    let likeButtonXPath = Utils.getElementXPath(likeButton);
    if(!likeButtonXPath){
        return;
    }
    let buttonToClick = Utils.getElByXPath(likeButtonXPath + "/../../div//button[contains(string(), \"Repost\")]");
    if(!buttonToClick){
        buttonToClick = Utils.getElByXPath(likeButtonXPath + "/../../div//button[contains(string(), \"Share\")]");
    }
    if(!buttonToClick){
        return;
    }
    let buttonByQuery = document.querySelector('#' + buttonToClick.id);
    if(!buttonByQuery){
        return;
    }
    try {
        if (buttonByQuery) {
            buttonByQuery.focus();
            buttonByQuery.click();
            setTimeout(repostType.bind(this), 250, buttonByQuery, callback);
        }
    } catch (e) {
        console.log(e.stack);
    }
}

export const repostType = (buttonToClick, callback) => {
    let buttonToClickXPath =  Utils.getElementXPath(buttonToClick);
    let repostSubButton = Utils.getElByXPath(buttonToClickXPath + "/../div//ul/li[2]/div/span[contains(string(), \"Repost\")]");
    if (repostSubButton) {
        repostSubButton.focus();
        repostSubButton.click();
        callback({key: "repost", result: true, parentId: 0, cover: 100});
    }
}

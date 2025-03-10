
// activity

import {Utils} from "html-evaluate-utils/Utils";

const postData = {
    activity: 1212,
    actorLink: "Jonas",
    actorName: "Developer",
    actorDescription: "Developer",
    text: "Developer",
}

const postDataXPath = {
    activity: `div[@data-id = 'urn:li:activity:${activityId}']`,
    actorLink : "div[contains(@class, 'update-components-actor__meta')]/a[contains(@class, 'app-aware-link')]",  //href turi visa reikiama info
    actorName: "span[contains(@class, 'update-components-actor__name')]/span",
    actorDescription: "span[contains(@class, 'update-components-actor__description')]/span",
    text: "div[contains(@class, 'update-components-text')]/span",
}

const getTextByActivity = (activityId) => {
    let el = Utils.getElByXPath(postDataXPath.activity + postDataXPath.text);
    if(el){
        return el.textContent;
    }
    //div[@data-id = 'urn:li:activity:7106853334094942211']//div[contains(@class, 'update-components-actor__meta')]/a/span
    return "";
}
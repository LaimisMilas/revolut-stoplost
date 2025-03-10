
chrome.runtime.onInstalled.addListener(async () => {
    let ruleIds = 0;
    chrome.declarativeNetRequest.getDynamicRules().then((rules) => {
        ruleIds = rules.map(rule => rule.id);
        chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: ruleIds});
        // Now add your new rules
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    "id": 1,
                    "priority": 1,
                    "action": {
                        "type": "modifyHeaders",
                        "responseHeaders": [
                            {
                                "header": "Content-Security-Policy",
                                "operation": "remove"
                            }
                        ]
                    },
                    "condition": {
                        "urlFilter": "https://www.linkedin.com/*",
                        "resourceTypes": ["main_frame", "sub_frame"]
                    }
                }
            ]
        });
    }).catch((error) => {
        console.error(error);
    });
});

/**
 * Kada tikrina visus request/response LinkedIn pakimba.
 * Gal reiktu tikrinti tik pirma užklausą:
 * Request URL: https://www.linkedin.com/feed/
 * */

/* global chrome */

// List of tabIds where CSP headers are disabled
var disabledTabIds = [];

var isCSPDisabled = function (tabId) {
    return disabledTabIds.includes(tabId);
};

var toggleDisableCSP = function (tabId) {
    if (isCSPDisabled(tabId)) {
        // remove this tabId from disabledTabIds
        disabledTabIds = disabledTabIds.filter(function (val) {
            return val !== tabId;
        });
    } else {
        disabledTabIds.push(tabId);

        // Sites that use Application Cache to cache their HTML document means this
        // extension is not able to alter HTTP response headers (as there is no HTTP
        // request when serving documents from the cache).
        //
        // An example page that this fixes is https://web.whatsapp.com
        //chrome.browsingData.remove({}, { serviceWorkers: true }, function () {
        //  console.log('removed');
        //});
    }

    var isDisabled = isCSPDisabled(tabId);
    var iconName = isDisabled ? 'on' : 'off';
    var title = isDisabled ? 'disabled' : 'enabled';
};

var userData = "LAK";

function getUserData(request, sender, sendResponse) {
    if( isOriginValid(sender) && request.key === "lc_get_auth_token"){
        sendResponse(userData);
    }
}

function setUserData(request, sender, sendResponse) {
    if(isOriginValid(sender) && request.key === "lc_set_auth_token"){
        userData = request.result;
        sendResponse(request.key);
    }
}
function isClickerInstalled(request, sender, sendResponse) {
    if(isOriginValid(sender) && request.key === "lc_get_is_clicker_installed"){
        sendResponse(request.key);
    }
}

function isOriginValid(sender){
    return sender.origin.includes("https://linkedin-click.web.app")
        || sender.origin.includes("https://www.linkedin.com")
        || sender.origin.includes("http://localhost")
        || sender.origin.includes("clicker.lt")
        || sender.origin.includes("https://nosqlstore.web.app");
}

chrome.runtime.onMessage.addListener(getUserData);
chrome.runtime.onMessage.addListener(setUserData);
chrome.runtime.onMessage.addListener(isClickerInstalled);

var init = function () {
    // When the user clicks the plugin icon
    chrome.action.onClicked.addListener(function (tab) {
        toggleDisableCSP(tab.id);
    });

};

init();


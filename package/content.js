
//Siunčia žintute į service worker kur bus laikinai issaugota data
function sendUserAuth(event) {
    chrome.runtime.sendMessage({
        result: event.data.result,
        key: "lc_set_auth_token"
    });
}

function getUserAuth() {
    chrome.runtime.sendMessage({
        result: "linkedIn-Clicker",
        key: "lc_get_auth_token"
    }, (response) => {
        if (response && response !== "LAK") {
            postAuthResponse(response);
        }
    });
}

function postAuthResponse(response) {
    window.postMessage({
        type: 'lc_auth_token_response',
        response: response
    }, '*');
}

function sendMessageIsClickerInstalled() {
    chrome.runtime.sendMessage({
        result: "Is-Installed-linkedIn-Clicker",
        key: "lc_get_is_clicker_installed"
    }, (response) => {
        if (response && response === "lc_get_is_clicker_installed") {
            postClickerInstalled(response);
        }
    });
}

function postClickerInstalled(response) {
    console.log("Content.postClickerInstalled(), response: " + response);
    window.postMessage({
        type: 'lc_get_is_clicker_installed_response',
        response: response
    }, '*');
}


function addWindowEvents() {
    //Klausosi clicker-web kada atsius žinutę su raktu lc_set_auth_token
    window.addEventListener('message', (event) => {
        if (event.data.type === 'lc_set_auth_token' && chrome && chrome.runtime) {
            sendUserAuth(event);
        }
    });

    window.addEventListener('message', (event) => {
        if (event.data.type === 'lc_get_auth_token' && chrome && chrome.runtime) {
            getUserAuth();
        }
    });

    window.addEventListener('message', (event) => {
        if (event.data.type === 'lc_get_is_clicker_installed' && chrome && chrome.runtime) {
            sendMessageIsClickerInstalled();
        }
    });
}

addWindowEvents();


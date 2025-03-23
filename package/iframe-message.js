
function postAuthResponse(response) {
    window.postMessage({
        type: 'lc_auth_token_response',
        response: response
    }, '*');
   // window.parent.postMessage("Duomenys is iframe!", "*");
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

function addWindowEvents() {
    window.addEventListener('message', (event) => {
        if (event.data.type === 'lc_get_auth_token' && chrome && chrome.runtime) {
            getUserAuth();
        }
    });
}

addWindowEvents();
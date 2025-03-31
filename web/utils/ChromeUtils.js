export function listenForMessages(callback) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.data) {
            window.postMessage({ type: "EXTENSION_DATA", data: message }, "*");
            if (callback) callback(message);
        }
    });
}
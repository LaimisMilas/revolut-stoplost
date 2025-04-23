chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.url === "tickers") {

        const handler = (event) => {
            if (event.source !== window) return;
            if (event.data.type === "EXTENSION_RESPONSE") {
                window.removeEventListener("message", handler);
                sendResponse({ success: event.data.success, error: event.data.error });
            }
        };

        window.addEventListener("message", handler);
        window.postMessage({ type: "EXTENSION_DATA", data: request }, "*");

        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.ping) {
        sendResponse({ alive: true });
    }
});

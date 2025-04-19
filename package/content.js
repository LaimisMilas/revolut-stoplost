chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.url === "tickers") {
        let responded = false;

        const handler = (event) => {
            if (event.source !== window) return;
            if (event.data.type === "EXTENSION_RESPONSE") {
                responded = true;
                window.removeEventListener("message", handler);
                sendResponse({ success: event.data.success, error: event.data.error });
            }
        };

        window.addEventListener("message", handler);
        window.postMessage({ type: "EXTENSION_DATA", data: request }, "*");

        // Timeout apsauga
        setTimeout(() => {
            if (!responded) {
                console.warn("❌ Timeout: puslapis neatsako – perkraunam");
                window.removeEventListener("message", handler);
                location.reload(); // arba siųsti signalą atgal į background
            }
        }, 3000);

        return true;
    }
});

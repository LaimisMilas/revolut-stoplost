chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data) {
        //console.log("📩 Gauti duomenys iš background.js:", message.data);
        // 🔥 Įrašome į `window` global scope
        window.postMessage({ type: "EXTENSION_DATA", data: message.data }, "*");
    }
});
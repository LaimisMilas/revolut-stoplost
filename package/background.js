function getNowDate(date) {
    let fullYear = date.getFullYear();
    let month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return fullYear + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}

var cryptoTabId = null;

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({url: "cryptoAI.html"}, (newTab) => {
        cryptoTabId = newTab.id;
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("revolut.com")) {
       // console.log("🔎 Rastas Revolut tab'as:", tabId);

        chrome.debugger.attach({tabId}, "1.3", function () {
            //console.log("✅ Debugger prijungtas!");
            chrome.debugger.sendCommand({tabId}, "Network.enable");
        });

        chrome.debugger.onEvent.addListener((source, method, params) => {
            if (method === "Network.responseReceived") {
                chrome.debugger.sendCommand(
                    {tabId: source.tabId},
                    "Network.getResponseBody",
                    {requestId: params.requestId},
                    (response) => {
                        if (params.response.url.includes("api/crypto-exchange/tickers")) {
                            // 🔥 Siunčiame duomenis į content.js script
                            if (response.body) {
                                let date = new Date();
                                let data = JSON.parse(response.body);
                                const searchPair = "SOL/USD";
                                const result = data.find(item => item.pair === searchPair);
                                result.time = getNowDate(date);
                                result.seconds = date.getSeconds();
                                chrome.tabs.sendMessage(source.tabId, {url: "tickers", data: result }, (response) => {
                                    if (chrome.runtime.lastError) {
                                        console.error("Klaida:", chrome.runtime.lastError.message);
                                        return;
                                    }
                                    if (response?.success) {
                                       // console.log("✅ Duomenys sėkmingai perduoti ir apdoroti!");
                                    } else {
                                        console.warn("⚠️ Klaida puslapyje:", response?.error);
                                        // ⏳ Perkraunam tą patį tab
                                        chrome.tabs.reload(source.tabId);
                                    }
                                });
                                if(cryptoTabId){
                                    chrome.tabs.sendMessage(cryptoTabId, {url: "tickers", data: result });
                                }
                            }
                        } else {
                            // history tai paskutiniu 15 min, zvake
                            if (params.response.url.includes("2/api/crypto-exchange/currencies/SOL-USD/chart/history")) {
                                if (response.body) {
                                    let data = JSON.parse(response.body);
                                    chrome.tabs.sendMessage(source.tabId, {url: "history", data});
                                    if (cryptoTabId) {
                                        chrome.tabs.sendMessage(cryptoTabId, {url: "history", data});
                                    }
                                }
                            }

                        }
                    }
                );
            }
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("revolut.com")) {
        // Tikrinam ar content.js jau veikia (galim per message)
        chrome.tabs.sendMessage(tabId, { ping: true }, (response) => {
            if (chrome.runtime.lastError || !response) {
                console.warn("❌ content.js neveikia – injectinam rankiniu būdu");
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["content.js"]
                });
            } else {
                console.log("✅ content.js gyvas");
            }
        });
    }
});


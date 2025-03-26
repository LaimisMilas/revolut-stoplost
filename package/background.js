
function getNowDate(date){
    let fullYear = date.getFullYear();
    let month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return fullYear + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes("revolut.com")) {
        console.log("🔎 Rastas Revolut tab'as:", tabId);

        chrome.debugger.attach({ tabId }, "1.3", function() {
            console.log("✅ Debugger prijungtas!");
            chrome.debugger.sendCommand({ tabId }, "Network.enable");
        });

        chrome.debugger.onEvent.addListener((source, method, params) => {
            if (method === "Network.responseReceived") {
                chrome.debugger.sendCommand(
                    { tabId: source.tabId },
                    "Network.getResponseBody",
                    { requestId: params.requestId },
                    (response) => {
                        if(params.response.url.includes("api/crypto-exchange/tickers")){
                            //console.log("📥 Perimta užklausa:", params.response.url);
                            //console.log("🔎 Atsakymas:", response.body);
                            // 🔥 Siunčiame duomenis į content script
                            if(response.body){
                                let date = new Date();
                                let data = JSON.parse(response.body);
                                const searchPair = "SOL/USD";
                                const result = data.find(item => item.pair === searchPair);
                                result.time = getNowDate(date);
                                result.seconds = date.getSeconds();
                                chrome.tabs.sendMessage(source.tabId, { data: result });
                            }
                        }
                    }
                );
            }
        });
    }
});


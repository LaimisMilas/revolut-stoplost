
export function interceptFetch(urlPath = "api/crypto-exchange/tickers"){
    // Išsaugom originalias funkcijas
    const originalFetch = window.fetch;
    // Perimam fetch
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const clone = response.clone(); // Nekeičiam originalo
        if (args[0].includes(urlPath)) {
            clone.text().then(data => {
                console.log("Intercepted fetch response:", data);
            }).catch(err => console.error("Fetch response error:", err));
        }
        return response;
    };
}

export function interceptXMLHttpRequest(urlPath = "api/crypto-exchange/tickers"){
    // Perimam XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const open = xhr.open;
        xhr.open = function(method, url, ...rest) {
            this._url = url; // Išsaugom URL
            return open.apply(this, [method, url, ...rest]);
        };
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4 && this._url.includes(urlPath)) {
                console.log("Intercepted XHR response:", this.responseText);
            }
        });
        return xhr;
    };
}

export function interceptWebSocket() {
    const OriginalWebSocket = window.WebSocket;
    // Perrašom WebSocket klasę
    window.WebSocket = function(...args) {
        const ws = new OriginalWebSocket(...args);
        ws.addEventListener("message", function(event) {
            console.log("Intercepted WebSocket message:", event.data);
        });
        return ws;
    };
}

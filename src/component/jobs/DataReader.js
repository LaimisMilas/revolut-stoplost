import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const DataReader = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

        function interce(urlPath = "api/crypto-exchange/tickers"){
            // Perimam XMLHttpRequest
            const originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                const xhr = new originalXHR();
                const open = xhr.open;
                xhr.open = function(method, url, ...rest) {
                    this._url = url; // Išsaugom URL
                    return open.apply(this, [method, url, ...rest]);
                };
                xhr.addEventListener("readystatechange", async function () {
                    if (this.readyState === 4 && this._url.includes(urlPath)) {
                        console.log("Intercepted XHR response:", this.responseText);
                        await doAction(this.responseText);
                    }
                });
                return xhr;
            };
        }

        useEffect(() => {
            interce();
        }, []);

        const doAction = async (responseText) => {

        }

    }));

export default DataReader;


import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const TickerResaver = inject("tickerService")(
    observer(({tickerService}) => {

        function dataStructureValid(event) {
            return event.source === window
                && event.data.hasOwnProperty("data")
                && event.data.hasOwnProperty("type")
                && event.data.data.hasOwnProperty("url")
                && event.data.data.hasOwnProperty("data")
                && event.data.type === "EXTENSION_DATA";
        }

        function addEventListener(){
            window.addEventListener("message", async (event) => {
                const shouldStoreTicket = dataStructureValid(event);
                if (shouldStoreTicket) {
                    try {
                        await doAction(event.data.data);
                        // ✅ Siunčiam atsakymą atgal
                        window.postMessage({ type: "EXTENSION_RESPONSE", success: true }, "*");
                    } catch (e) {
                        window.postMessage({ type: "EXTENSION_RESPONSE", success: false, error: e.message }, "*");
                    }
                }
            });
        }

        useEffect(() => {
            addEventListener();
        }, []);

        const doAction = async (result) => {
            if(result.url === "tickers"){
                tickerService.pushNewTicker(result.data);
                tickerService.tickerCounter++;
            }
        }
    }));

export default TickerResaver;


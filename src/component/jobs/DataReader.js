import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {TickerService} from "../../service/TickerService";


const DataReader = inject("indicatorReadState","tickerService")(
    observer(({indicatorReadState,tickerService}) => {

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

        let secTickerBuffer = [];

        const doAction = async (result) => {
            if(result.url === "tickers"){
                if (secTickerBuffer.length > 0 && secTickerBuffer[0].seconds !== result.data.seconds) {
                    let avgSecPrice = secTickerBuffer.reduce((sum, item) => sum + parseFloat(item.indexPrice), 0) / secTickerBuffer.length;
                    let updatedTicker = {...result.data, indexPrice: avgSecPrice.toFixed(6)};

                    tickerService.pushNewTicker(updatedTicker);
                    tickerService.tickerIndex++;

                    indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, updatedTicker, 11250);
                    indicatorReadState.calculateRSITicker(600 + 14, 30);
                    indicatorReadState.last100RSICounter ++;
                    secTickerBuffer = [];
                }
                secTickerBuffer.push(result.data);
            }

            if(result.url === "history"){
                // history tai paskutiniu 15 min, zvake
                //tickerService.pushNewHistory(result.data);
            }

            indicatorReadState.tickerIndex++;
        }
    }));

export default DataReader;


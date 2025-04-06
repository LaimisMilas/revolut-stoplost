import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const DataReader = inject("indicatorReadState","tickerService")(
    observer(({indicatorReadState,tickerService}) => {

        function addEventListener(){
            window.addEventListener("message", async (event) => {
                if (event.source !== window) return;
                if (event.data.type === "EXTENSION_DATA") {
                    await doAction(event.data.data);
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
                    indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, updatedTicker, 11250);
                    indicatorReadState.calculateRSITicker(600 + 14, 30);
                    indicatorReadState.updateLast100Price();
                    indicatorReadState.last100RSICounter ++;
                    secTickerBuffer = [];
                }
                secTickerBuffer.push(result.data);
            }

            if(result.url === "history2"){
                result.data.seconds = new Date().getSeconds();
                result.data.indexPrice = result.data.c[1];
                if (secTickerBuffer.length > 0 && secTickerBuffer[0].seconds !== result.data.seconds) {
                    let avgIndexPrice = secTickerBuffer.reduce((sum, item) => sum + parseFloat(item.indexPrice), 0) / secTickerBuffer.length;
                    let averagedData = {...result.data, indexPrice: avgIndexPrice.toFixed(6)};
                    indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, averagedData, 11250);
                    indicatorReadState.calculateRSITicker(600 + 14, 30);
                    indicatorReadState.updateLast100Price();
                    indicatorReadState.last100RSICounter ++;
                    secTickerBuffer = [];
                }
                secTickerBuffer.push(result.data);
            }
        }
    }));

export default DataReader;


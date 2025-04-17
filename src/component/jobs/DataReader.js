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
                    indicatorReadState.calcParabolicCorrelation();
                    secTickerBuffer = [];
                }
                secTickerBuffer.push(result.data);
            }

            if(result.url === "history"){
                tickerService.pushNewHistory(result.data);
            }

            indicatorReadState.tickerIndex++;
        }
    }));

export default DataReader;


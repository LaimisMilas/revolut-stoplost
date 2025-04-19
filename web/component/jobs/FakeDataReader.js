import {inject, observer} from "mobx-react";
import {useEffect, useState} from "react";
import {tickersDownTrend} from "./ticker_dow_trend";
import {stop_lost} from "./stop_lost_tickers";

const FakeDataReader = inject("indicatorReadState", "tickerService")(
    observer(({indicatorReadState, tickerService}) => {

        function getStopLostTicker(){
            let data = stop_lost;
            let result = [];
            if(data.length > 0){
                data.map(item => result.push(...item.data));
            }
            return result;
        }

       const [tickerValue, setTickerValue] = useState(tickersDownTrend);
       const [stopLostTickers, setStopLostTickers] = useState(getStopLostTicker());

        function addEventListener(){
            window.addEventListener("message", async (event) => {
                if (event.source !== window) return;
                if (event.data.type === "EXTENSION_DATA") {
                    await saveHistoryData(event.data.data);
                   // await saveTickerData(event.data.data);

                }
            });
        }

        const updateIndex = () => {
            indicatorReadState.tickerIndex++;
        }

        let myInterval = null;

        useEffect(() => {
            addEventListener();
            const executeWithInterval = async () => {
               await doAction(indicatorReadState.tickerIndex);
               updateIndex();
                if(indicatorReadState.tickerIndex < 11250){
                    myInterval = setTimeout(executeWithInterval, 175);
                }
            };
            executeWithInterval().then();
            return () => {
                if (myInterval) {
                    clearInterval(myInterval);
                }
            }
        }, []);

        const saveHistoryData = (result) => {
            if(result.url === "history"){
                tickerService.pushNewHistory(result.data);
            }
        }

        const saveTickerData = (data) => {
            if(data.url === "tickers"){
                updateIndex();
                indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, data,data, 11250);
                //vienas ticker yra 1sec. tai 30 = 1/2 minutes.
                indicatorReadState.calculateRSITicker(600 + 14, 30);
                indicatorReadState.last100RSICounter++;
            }
        }

        const doAction = async (tickerIndex) => {
            const newValue = tickerValue[tickerIndex];
                indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, newValue, 11250);
                //vienas ticker yra 1sec. tai 30 = 1/2 minutes.
                indicatorReadState.calculateRSITicker(600 + 14, 30);
                indicatorReadState.last100RSICounter++;
        }

    }));

export default FakeDataReader;


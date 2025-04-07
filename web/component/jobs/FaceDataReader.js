import {inject, observer} from "mobx-react";
import {useEffect, useState} from "react";
import {tickersDownTrend} from "./ticker_dow_trend";

const FaceDataReader = inject("indicatorReadState", "tickerService")(
    observer(({indicatorReadState, tickerService}) => {

        const [tickerValue, setTickerValue] = useState(tickersDownTrend);

        function addEventListener(){
            window.addEventListener("message", async (event) => {
                if (event.source !== window) return;
                if (event.data.type === "EXTENSION_DATA") {
                    await saveHistoryData(event.data.data);
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


        const doAction = async (tickerIndex) => {
            const newValue = tickerValue[tickerIndex];
                indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, newValue, 11250);
                indicatorReadState.calculateRSITicker(600 + 14, 30);
                indicatorReadState.updateLast100Price();
                indicatorReadState.last100RSICounter++;
        }

    }));

export default FaceDataReader;


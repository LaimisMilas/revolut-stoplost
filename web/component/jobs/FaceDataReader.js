import {inject, observer} from "mobx-react";
import {useEffect, useState} from "react";
import {tickers} from "./static_ticker";

const FaceDataReader = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

        const [tickerValue, setTickerValue] = useState(tickers);

        function addEventListener(){
            window.addEventListener("message", async (event) => {
                if (event.source !== window) return;
                if (event.data.type === "EXTENSION_DATA") {
                   // await doAction(event.data.data);
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
                    myInterval = setTimeout(executeWithInterval, 75);
                }
            };
            executeWithInterval().then();
            return () => {
                if (myInterval) {
                    clearInterval(myInterval);
                }
            }
        }, []);


        const doAction = async (tickerIndex) => {
            const newValue = tickerValue[tickerIndex];
                indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, newValue, 11250);
                indicatorReadState.calculateRSITicker(600 + 14, 30);
                indicatorReadState.updateLast100Price();
                indicatorReadState.last100RSICounter++;
        }

    }));

export default FaceDataReader;


import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const DataReader = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

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

        let r = '{' +
            '"pair":"SOL/USD",' +
            '"bid":"139.706",' +
            '"ask":"139.706",' +
            '"mid":"139.706",' +
            '"indexPrice":"139.6477952750000",' +
            '"low24h":"139.5",' +
            '"high24h":"147.5",' +
            '"change24h":"-6.613",' +
            '"volume24h":"3601511210.32",' +
            '"marketCap":"72691120872.90",' +
            '"percentageChange24h":"-4.51957700",' +
            '"time":"2025-03-26T16:25:01",' +
            '"seconds":23}'

        let ticker = [];

        const doAction = async (result) => {
            if (ticker.length > 0 && ticker[0].seconds !== result.seconds) {
                let avgIndexPrice = ticker.reduce((sum, item) => sum + parseFloat(item.indexPrice), 0) / ticker.length;
                let averagedData = {...result, indexPrice: avgIndexPrice.toFixed(6)};
                indicatorReadState.tickerValue = indicatorReadState.pushWithLimit(indicatorReadState.tickerValue, averagedData, 11250);
                ticker = [];
            }
            ticker.push(result);
        }

    }));

export default DataReader;


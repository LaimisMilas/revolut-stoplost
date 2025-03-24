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

        const doAction = async (responseData) => {
            console.log("Gavome duomenis iš extension:", responseData);
            indicatorReadState.tickerValue.push(responseData);
        }

    }));

export default DataReader;


import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const DataReader = inject("indicatorReadState")(
    observer(({indicatorReadState}) => {

        function interce(){
            window.addEventListener("message", async (event) => {
                if (event.source !== window) return; // Užtikrina, kad duomenys ateina iš mūsų kodo
                if (event.data.type === "EXTENSION_DATA") {
                    await doAction(event.data.data);
                }
            });
        }

        useEffect(() => {
            interce();
        }, []);

        const doAction = async (responseData) => {
            console.log("Gavome duomenis iš extension:", responseData);
            indicatorReadState.tickerValue.push(responseData);
        }

    }));

export default DataReader;


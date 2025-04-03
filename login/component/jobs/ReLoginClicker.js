import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {Utils} from "html-evaluate-utils/Utils";
import {sleep} from "../../../src/utils/RevolutUtils";

const ReLoginClicker = inject("buyState", "sellState", "indicatorReadState")(
    observer(({buyState, sellState, indicatorReadState}) => {

        useEffect(() => {
            const executeWithInterval = async () => {
                await doLogin();
                indicatorReadState.localInterval = setTimeout(executeWithInterval, 1000);
            };
            executeWithInterval().then();
            return () => {
                if (buyState.localInterval) {
                    clearInterval(buyState.localInterval);
                }
            }
        }, []);

        const doLogin = async () => {
           await clickLogin();
           if(window.location.href.includes("https://exchange.revolut.com/home")){
               window.location.href = "https://exchange.revolut.com/trade/SOL-USD";
           }
        }

        const clickLogin = async () => {
            let el = Utils.getElByXPath("//button/span[contains(text(), 'Prisijungti')]/..");
            if(el){
                el.click();
                await sleep(11300);
                return 100;
            }
            return 0;
        }

    }));

export default ReLoginClicker;


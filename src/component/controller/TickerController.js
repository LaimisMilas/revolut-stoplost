import {inject, observer} from "mobx-react";
import {useEffect} from "react";

const TickerController = inject("tickerService", "candleService")(
    observer(({tickerService, candleService}) => {

        useEffect(() => {
            const runActions = async () => {
                await doAction();
            }
            runActions().then();
        }, [tickerService.tickerIndex]);

        const doAction = async () => {
            const ticker = tickerService.getLastTickers();
            await tickerService.storeTicker(ticker);
            candleService.candleCounter++;
        }
    }));

export default TickerController;


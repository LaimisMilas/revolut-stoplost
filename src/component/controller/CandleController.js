import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {aggregateToCandles} from "../../utils/AggregateToCandles";

const CandleController = inject("candleService","tickerService")(
    observer(({candleService, tickerService}) => {

        useEffect(() => {
            const runActions = async () => {
                await doAction();
            }
            runActions().then();
        }, [tickerService.tickerIndex]);

        const doAction = async () => {
            const candles = aggregateToCandles(tickerService.tickers, 60);
            candleService.pushNewHistoryCandle(candles[candles.length -1]);
            candleService.updateCurrentCandle();
            //await candleService.storeCurrentCandle();
            candleService.rootStore.saveStorage();
        }
    }));

export default CandleController;


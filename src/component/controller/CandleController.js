import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {aggregateToCandles2} from "../../utils/AggregateToCandles";

const CandleController = inject("candleService","tickerService", "indicatorState")(
    observer(({candleService, tickerService, indicatorState}) => {

        useEffect(() => {
            const runActions = async () => {
                await doAction();
            }
            runActions().then();
        }, [candleService.candleCounter]);

        const doAction = async () => {
            const candles = aggregateToCandles2(tickerService.tickers, 60 * 5);
            candleService.setHistoryCandles(candles);
            candleService.updateCurrentCandle();
            indicatorState.indicatorCounter++;
        }
    }));

export default CandleController;


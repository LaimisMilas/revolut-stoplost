import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {aggregateToCandles} from "../../utils/AggregateToCandles";

const IndicatorController = inject("candleService","tickerService", "indicatorReadState")(
    observer(({candleService, tickerService, indicatorReadState}) => {

        useEffect(() => {
            const runActions = async () => {
                await doAction();
            }
            runActions().then();
        }, [tickerService.tickers.length]);

        const doAction = async () => {
            indicatorReadState.tickerValue = tickerService.getTickers();
            indicatorReadState.calculateRSITicker(600 + 14, 30);
            indicatorReadState.last100RSICounter++;
            indicatorReadState.updateMinCandles();
        }
    }));

export default IndicatorController;


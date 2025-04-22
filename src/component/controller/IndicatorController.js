import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {calculateRSI} from "../../indicator/RSI14";

const IndicatorController = inject("candleService","tickerService", "indicatorState")(
    observer(({candleService, tickerService, indicatorState}) => {

        useEffect(() => {
            const runActions = async () => {
                await doAction();
            }
            runActions().then();
        }, [indicatorState.indicatorCounter]);

        const doAction = async () => {
            const tickers = tickerService.getTickers();
            const prices = convertToPrice(tickers);
            const rsi = calculateRSI(prices);
            const candles = candleService.getHistoryCandle();
            if(prices){
                indicatorState.calculateDynamicTrend(prices);
                indicatorState.calculateAroon(prices, 900);
                indicatorState.calcRSITableValues(prices);
            }
            if(rsi){
                indicatorState.calcBearishLineCorrelation(rsi);
                indicatorState.calcBullishLineCorrelation(rsi);
                indicatorState.calcLeftLineCorrelation(rsi);
                indicatorState.calcParabolicCorrelation(rsi)
                indicatorState.calcSinusoidCorrelation(rsi);
            }
            if(candles){
                indicatorState.updateATR(candles);
                indicatorState.updateCandleAnalyzer(candles);
            }
            if(prices && rsi){
                indicatorState.calculateDivergence(prices, rsi);
            }
            indicatorState.updateTrailingBuyBot();
        }

        const convertToPrice = (tickers) => {
            if(tickers.length > 0){
                return tickers.map(item => parseFloat(item.indexPrice));
            }
            return null;
        }

    }));

export default IndicatorController;


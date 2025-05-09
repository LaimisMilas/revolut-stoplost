import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {calculateRSI} from "../../indicator/RSI14";

const IndicatorController = inject("candleService", "indicatorState")(
    observer(({candleService, indicatorState}) => {

        useEffect(() => {
            const runActions = async () => {
                await doAction();
            }
            runActions().then();
        }, [indicatorState.indicatorCounter]);

        const doAction = async () => {
            const candles = candleService.getHistoryCandle();
            const prices = convertToPrice(candles);
            if(prices){
                indicatorState.calcRSITableValues(prices);
                indicatorState.calculateAroon(prices);
                indicatorState.calculateDynamicTrend(prices);
                indicatorState.calcParabolicCorrelation(prices)
                indicatorState.calcSinusoidCorrelation(prices);
                indicatorState.calcLeftLineCorrelation(prices);
                indicatorState.calcBullishLineCorrelation(prices);
                indicatorState.calcBearishLineCorrelation(prices);
                indicatorState.updateATR(prices);
                indicatorState.updateCandleAnalyzer(candles);
                indicatorState.calculateDivergence(prices);
                indicatorState.calcRSI14(prices);
            }
            indicatorState.updateTrailingBuyBot();
        }

        const convertToPrice = (candles) => {
            if(candles.length > 0){
                return candles.map(item => parseFloat(item.close));
            }
            return null;
        }

    }));

export default IndicatorController;


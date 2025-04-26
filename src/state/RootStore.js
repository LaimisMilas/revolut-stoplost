import {SellState} from './SellState';
import {SellPanelState} from './SellPanelState';
import {LocalStorageManager} from "../storage/LocalStorageManager";
import {BuyState} from "./BuyState";
import {BuyPanelState} from "./BuyPanelState";
import {IndicatorReadState} from "./IndicatorReadState";
import {TrailingService} from "../service/TrailingService";
import {TickerService} from "../service/TickerService";
import {CandleService} from "../service/CandleService";
import {IndicatorState} from "./IndicatorState";

export class RootStore {
    sellState = null;
    buyState = null;
    sellPanelState = null;
    buyPanelState = null;
    indicatorReadState = null;
    prefix = "lc_";

    constructor(prefix = "lc_") {
        this.prefix = prefix;
        this.sellState = new SellState();
        this.buyState = new BuyState();
        this.sellPanelState = new SellPanelState();
        this.buyPanelState = new BuyPanelState();
        this.indicatorReadState = new IndicatorReadState();
        this.trailingService = new TrailingService();
        this.tickerService = new TickerService();
        this.candleService = new CandleService();
        this.indicatorState = new IndicatorState();
        this.setupLocalStorageMap(); // <- svarbu
        this.setupStoreRelationships("RootStore.constructor()");
    }

    setupStoreRelationships() {
        this.sellState.setup(this, this.sellPanelState);
        this.buyState.setup(this, this.buyPanelState);
        this.sellPanelState.setup(this, this.sellState);
        this.buyPanelState.setup(this, this.buyState);
        this.indicatorReadState.setup(this);
        this.trailingService.setup(this);
        this.tickerService.setup(this);
        this.candleService.setup(this);
        this.indicatorState.setup(this);

        const storeState = LocalStorageManager.getStorage(this.prefix + "store_state");
        if (storeState && storeState === 1) {
            this.reverseLoudLocalStorage();
        } else {
            this.saveStorage(true); // initial persist
        }

        this.setIntervalSaveStorage();
    }

    intervalSaveStorageTimeOut = 30000;
    intervalSaveStorage = null;

    setIntervalSaveStorage() {
        this.intervalSaveStorage = setInterval(
            () => this.saveStorage(),
            this.intervalSaveStorageTimeOut
        );
    }

    reduce(acc, bcc) {
        return acc.concat(bcc || []);
    }

    setupLocalStorageMap() {
        this.localStorageMap = [
            { key: "sell_systemCfg", ref: () => this.sellState.systemCfg, merge: "assign" },
            { key: "sell_tradePares", ref: () => this.sellState.tradePares, merge: "assign" },
            { key: "buy_tradePares", ref: () => this.buyState.tradePares, merge: "assign" },
            { key: "buy_systemCfg", ref: () => this.buyState.systemCfg, merge: "assign" },
            { key: "sell_rowConfig", ref: () => this.sellPanelState.rowConfig, merge: "assign" },
            { key: "buy_rowConfig", ref: () => this.buyPanelState.rowConfig, merge: "assign" },
       //     { key: "last100RSIValue", ref: () => this.indicatorReadState.last100RSIValue, merge: "concat" },
       //     { key: "last100PriceValue", ref: () => this.indicatorReadState.last100PriceValue, merge: "concat" },
       //     { key: "last1kRSIValue", ref: () => this.indicatorReadState.last1kRSIValue, merge: "concat" },
            { key: "buy_aspectCorrelation", ref: { parent: () => this.buyState, field: "aspectCorrelation" }, merge: "replace", defaultValue: 0 },
            { key: "sell_aspectCorrelation", ref: { parent: () => this.sellState, field: "aspectCorrelation" }, merge: "replace", defaultValue: 0 },
            { key: "sell_msgs", ref: () => this.sellState.msgs, merge: "concat" , defaultValue: []},
            { key: "buy_msgs", ref: () => this.buyState.msgs, merge: "concat" , defaultValue: []},
     //       { key: "tickerValue", ref: () => this.indicatorReadState.tickerValue, merge: "concat" , defaultValue: []},
            { key: "ticker_service_tickers", ref: () => this.tickerService.tickers, merge: "concat", defaultValue: []},
         //   { key: "ticker_index", ref: { parent: () => this.indicatorReadState, field: "tickerIndex" }, merge: "replace" },
            { key: "count_try_sell", ref: { parent: () => this.sellState, field: "countTrySell" }, merge: "replace", defaultValue: 0 },
            { key: "count_try_buy", ref: { parent: () => this.buyState, field: "countTryBuy" }, merge: "replace", defaultValue: 0},
            { key: "dynamic_trend_data_length", ref: { parent: () => this.indicatorReadState, field: "dynamicTrendDataLength" }, merge: "replace", defaultValue: 0},
            { key: "dynamic_trend_chunk_size", ref: { parent: () => this.indicatorReadState, field: "dynamicTrendChunkSize" }, merge: "replace", defaultValue: 0},
            { key: "try_sell_prices", ref: () => this.sellState.trySellPrices, merge: "concat", defaultValue: []},
            { key: "try_buy_prices", ref: () => this.buyState.tryBuyPrices, merge: "concat", defaultValue: []},
       //     { key: "min_candles", ref: () => this.indicatorReadState.minCandles, merge: "concat", defaultValue: []},
            { key: "candle_service_candles", ref: () => this.candleService.historyCandle, merge: "concat", defaultValue: []},
            { key: "sellState_position", ref: { parent: () => this.sellState, field: "position" }, merge: "assign", defaultValue: this.sellState.position},
            { key: "sellState_orders_book", ref: () => this.sellState.orders, merge: "concat", defaultValue: []},
            { key: "indicatorState_current_signal", ref: { parent: () => this.indicatorState, field: "currentSignal" }, merge: "replace", defaultValue: "balSignal"},
            { key: "indicatorState_current_pattern", ref: { parent: () => this.indicatorState, field: "currentPattern" }, merge: "replace", defaultValue: "balPattern"},

        ];
    }

    saveStorage(isInitial = false) {
        this.localStorageMap.forEach(entry => {
            const value = typeof entry.ref === "function"
                ? entry.ref()
                : entry.ref.parent()[entry.ref.field];

            LocalStorageManager.flash(this.prefix + entry.key, value);
        });

        if (isInitial) {
            LocalStorageManager.flash(this.prefix + "store_state", 1);
        }
    }

    reverseLoudLocalStorage() {
        this.localStorageMap.forEach(entry => {
           // const stored = LocalStorageManager.getStorage(this.prefix + entry.key);
            const stored = LocalStorageManager.getStorage(this.prefix + entry.key) ?? entry.defaultValue;

            if (stored == null) return;

            if (typeof entry.ref === "function") {
                const target = entry.ref();
                switch (entry.merge) {
                    case "assign":
                        Object.assign(target, stored);
                        break;
                    case "concat":
                        if (Array.isArray(target)) {
                            target.push(...stored);
                        }
                        break;
                }
            } else if (entry.ref.parent && entry.ref.field) {
                const parent = entry.ref.parent();
                parent[entry.ref.field] = stored;
            }
        });
    }
}

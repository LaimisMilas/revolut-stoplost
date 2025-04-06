import { makeAutoObservable} from "mobx";
import {downsampleArray} from "../utils/dataFilter";

export class TickerService {

    rootStore = null;
    tickers = [];
    maxTickerLength = 11250;
    prices = [];
    priceChunkSize = 218;
    lastPriceValue = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setup(rootStore) {
        this.rootStore = rootStore;
    }

    pushNewTicker(pushNewValue) {
        this.tickers.push(pushNewValue); // Pridedame į galą
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers.shift(); // Pašaliname pirmą (seniausią) elementą
        }
        if (this.tickers.length > this.maxTickerLength) {
            this.tickers = this.tickers.slice(this.tickers.length - this.maxTickerLength, this.tickers.length);
            this.parsePrices(this.tickers.length, this.priceChunkSize);
        }
    }

    //327 = 15min. 109 = 5min. norint matyti MACD reikia bent 26 po 109
    // tai chunkSize = 109, 26 x 109 = 2834(mini data set)
    // length - masyvi dydis nuo galo, naudingas kada norima skaicioti ne is visu tickers reiksmiu
    parsePrices(length = 300, chunkSize = 1){
        let data = this.tickers.map(item => parseFloat(item.indexPrice));
        const from = data.length - length;
        const to = data.length - 1;
        data = downsampleArray(data.slice(from, to), chunkSize);
        this.prices = data;
        this.lastPriceValue = data[data.length -1];
    }

}

let ticker = '{' +
    '"pair":"SOL/USD",' +
    '"bid":"139.706",' +
    '"ask":"139.706",' +
    '"mid":"139.706",' +
    '"indexPrice":"139.6477952750000",' +
    '"low24h":"139.5",' +
    '"high24h":"147.5",' +
    '"change24h":"-6.613",' +
    '"volume24h":"3601511210.32",' +
    '"marketCap":"72691120872.90",' +
    '"percentageChange24h":"-4.51957700",' +
    '"time":"2025-03-26T16:25:01",' +
    '"seconds":23}'
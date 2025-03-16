import {Utils} from "html-evaluate-utils/Utils";

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const selectSellSwitch = async () => {
    let el = Utils.getElByXPath("//*[contains(text(), 'Parduoti')]")
    if(el){
        el.click();
        await sleep(300);
        return 100;
    }
    return 0;
}

export const selectBuySwitch = async () => {
    let el = Utils.getElByXPath("//*[contains(text(), 'Pirkti')]")
    if(el){
        el.click();
        await sleep(300);
        return 100;
    }
    return 0;
}

export const selectSellSum = async (value) => {
    let el = Utils.getElByXPath("//button/span[contains(text(), '" + value + "')][1]");
    if(el){
        el.click();
        await sleep(300);
        return 100;
    }
    return 0;
}

export const getRSIIndicator = async () => {
    let iframeDocument = Utils.getElByXPath("//iframe").contentWindow.document;
    let el = getElByXPathIframe("//*[contains(text(), 'RSI')]/../../../../div[2]", iframeDocument);
    if(el){
        return convertToNumber(el.innerText);
    }
    return false;
}

const getElByXPathIframe = (path, document) => {
    let result;
    let headings = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    if(headings){
        result = headings.iterateNext();
    }
    return result;
}

export const clickSell = async (tradeName) => {
    let el = Utils.getElByXPath("//button/span[contains(text(), 'Sell " + tradeName + "')][1]");
    if(el){
        el.click();
        await sleep(300);
        return 100;
    }
    return 0;
}

export const getBuyPrice = async (tradeName) => {
    let el = Utils.getElByXPath("//button/span[contains(text(), 'Buy " + tradeName + "')][1]");
    if(el){
        let text = el.innerText;
        return convertToNumber(text.replace("$", "").trim());
    }
    return 0;
}

export const clickBuy = async (tradeName) => {
    let el = Utils.getElByXPath("//button/span[contains(text(), 'Buy " + tradeName + "')][1]");
    if(el){
        el.click();
        await sleep(300);
        return 100;
    }
    return 0;
}

export const writeQuantity = async (quantity) => {
    let el = Utils.getElByXPath("//span/span[2]/span/label/div[2]/input");
    if(el){
        el.value = quantity;
        await sleep(300);
        return 100;
    }
    return 0;
}

export const readLastPrice = () => {
    let element =  Utils.getElByXPath("//*[contains(text(), 'Paskutinė kaina')]/../../span/div");
    if(element){
        let text = element.innerText;
        return convertToNumber(text.replace("$", "").trim());
    }
    return 0;
}

export const convertToNumber = (s) => {
    if(typeof s === "string"){
        return parseFloat(s.replace(",","."));
    }
    return s;
}

export function simpleMovingAverage(data, period) {
    return data.map((val, idx, arr) => {
        if (idx < period - 1) return val; // Nepakankamai duomenų vidurkiui
        const subset = arr.slice(idx - period + 1, idx + 1);
        return subset.reduce((sum, num) => sum + num, 0) / period;
    });
}

export function findDivergence(prices, rsi) {
    const len = prices.length;
    if (prices[len - 1] < prices[len - 2] && rsi[len - 1] > rsi[len - 2]) {
        return "Bullish divergencija - galima kilimo pradžia!";
    }
    if (prices[len - 1] > prices[len - 2] && rsi[len - 1] < rsi[len - 2]) {
        return "Bearish divergencija - galima korekcija!";
    }
    return "Divergencijos nėra.";
}

export function detectFractalPattern(rsi) {
    const len = rsi.length;
    if (rsi[len - 3] > rsi[len - 2] && rsi[len - 1] > rsi[len - 2]) {
        return "W dugnas - bullish signalas!";
    }
    if (rsi[len - 3] < rsi[len - 2] && rsi[len - 1] < rsi[len - 2]) {
        return "M viršūnė - bearish signalas!";
    }
    return "Fraktalinio modelio nėra.";
}

export const pearsonCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    const sumX2 = x.map(xi => xi ** 2).reduce((a, b) => a + b, 0);
    const sumY2 = y.map(yi => yi ** 2).reduce((a, b) => a + b, 0);
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
    return denominator === 0 ? 0 : numerator / denominator;
}

export const doParabolicCorrelation = (rsi5Value) => {

    // RSI14 paskutinės 10 reikšmių
    // const rsiValues = [30, 28, 27, 26, 25, 26, 28, 30, 33, 36];
    const rsiValues = rsi5Value;

    // Sukuriame parabolės formą su x^2
    const xValues = [...Array(225).keys()]; // [0, 1, 2, ..., 9]
    const parabolicValues = xValues.map(x => 0.5 * x ** 2 - 4 * x + 30); // a=0.5, b=-4, c=30

    // Apskaičiuojame koreliaciją
    const correlation = pearsonCorrelation(rsiValues, parabolicValues);

    console.log("Koreliacija su parabole:", correlation);

    if (correlation > 0.8) {
        console.log("Rinka gali keisti kryptį į viršų!");
    } else if (correlation < -0.8) {
        console.log("Rinka gali keisti kryptį į apačią!");
    } else {
        console.log("Nėra aiškios krypties.");
    }
}

export const isBuyReached = async (tradePare,lastPrice) => {
    let buyPrice = convertToNumber(tradePare.targetPrice);
    return lastPrice <= buyPrice;
}

export const isRSIDown = async (tradePare, rsiValue) => {
    if (rsiValue > 0) {
        let assetValue = tradePare.rsi;
        return rsiValue <= convertToNumber(assetValue);
    }
    return false;
}

export const getNowDate = () => {
    let date = new Date();
    let hours = date.getHours(); // hours
    let minutes = date.getMinutes(); // minutes
    let seconds = date.getSeconds(); // seconds
    return hours + ":" + minutes + ":" + seconds;
}

export const getTradeOrderValue = (tradeName) => {
    let element = Utils.getElByXPath("//*[contains(text(), '" + tradeName + "')]/../../../../../../../div[6]//span/span");
    if(element){
        let tmp = element.innerText.split('$');
        let sum = convertToNumber(tmp[0].replace("−","-").trim());
        let sumPercent = convertToNumber(tmp[1].replace("%","").trim());
        return [sum, sumPercent];
    }
    return [];
}
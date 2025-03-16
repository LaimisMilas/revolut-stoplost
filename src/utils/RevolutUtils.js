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
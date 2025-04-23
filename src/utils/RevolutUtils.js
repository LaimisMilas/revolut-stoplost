import {Utils} from "html-evaluate-utils/Utils";
import {postSellProcess} from "../component/jobs/sell/PostSellProcess";

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const selectSellSwitch = async () => {
    let el = Utils.getElByXPath("//*[contains(text(), 'Parduoti')]")
    if(el){
        el.click();
        await sleep(300);
        return el;
    }
    return null;
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

export const getClickSell = async (tradeName) => {
    let el = Utils.getElByXPath("//button/span[contains(text(), 'Sell " + tradeName + "')][1]");
    if(el){
        await sleep(300);
        return el;
    }
    return null;
}


//data-rui-part

export const hasOrderMessage = async () => {
    await sleep(5000);
    let el = Utils.getElByXPath("//div/div/div/div/span[contains(text(), 'Moments ago')]");
    if (el) {
        await sleep(300);
        return el;
    }
    return null;
}

export const getOrderType = async () => {
    let el = Utils.getElByXPath("//div/div/div/div/span[contains(text(), 'Moments ago')]/../../../../../div[3]");
    if (el) {
        await sleep(300);
        return el.textContent;
    }
    return null;
}

export const clickOrderHistory = async () => {
    let el = Utils.getElByXPath("//*[contains(text(), 'Pavedimų istorija')]");
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

export const sellOperation = async (tradePare) => {
    let result= 0;
    let el = await selectSellSwitch();
    //is switched to sell
    if(el.hasAttribute('aria-selected') && el.getAttribute('aria-selected') === 'false'){
        return 0;
    } else {
        result = 100;
    }
    if(result === 100){
        let quantityValue = tradePare.quantity;
        if(quantityValue.includes('%')){
            quantityValue = quantityValue.toString()
            if(quantityValue === '100%'){
                result += await selectSellSum(100);
            }
            if(quantityValue === '75%'){
                result += await selectSellSum(75);
            }
            if(quantityValue === '50%'){
                result += await selectSellSum(50);
            }
            if(quantityValue === '25%'){
                result += await selectSellSum(25);
            }
        } else {
            let quantity = convertToNumber(quantityValue);
            result += await writeQuantity(quantity);
        }
        //is quantity selected
        el = await getClickSell(tradePare.key);
        if(el.hasAttribute('disabled')){
            return 0;
        }
    }
    if(result === 200){
        result += await clickSell(tradePare.key);
        //is sold
        result += await sellApproval();
        if(await sellApproval() < 200){
             return result; // no approved
        }
    }
    return result;
}

export const buyOperation = async (tradePare) => {
    let result = await selectBuySwitch();
    if (result === 100) {
        let quantityValue = tradePare.quantity;
        if (quantityValue.includes('%')) {
            quantityValue = quantityValue.toString()
            if (quantityValue === '100%') {
                result += await selectSellSum(100);
            }
            if (quantityValue === '75%') {
                result += await selectSellSum(75);
            }
            if (quantityValue === '50%') {
                result += await selectSellSum(50);
            }
            if (quantityValue === '25%') {
                result += await selectSellSum(25);
            }
        } else {
            let quantity = convertToNumber(quantityValue);
            result += await writeQuantity(quantity);
        }
    }
    if (result === 200) {
        result += await clickBuy(tradePare.key);
    }
    return result;
}

export const sellApproval = async () => {
    let result = 0;
    result += await clickOrderHistory();
    if(result > 0 && await hasOrderMessage()){
        let orderType = await getOrderType();
        if(orderType.includes("Pardavimo")){
            console.log("orderType:" + orderType);
            result += 100;
        }
    }
    return result;
}
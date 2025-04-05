import React, {useState, useEffect, useMemo} from "react";
import {inject, observer} from "mobx-react";
import Draggable from "react-draggable";

const OrderList = inject("buyState", "sellState", "buyPanelState")(
    observer(({buyState, sellState, buyPanelState}) => {
        const sortByDate = (direct = "asc") => {
            const sortedOrders = [...orders].sort((a, b) => {
                return sortOrder === direct
                    ? new Date(a.time) - new Date(b.time)
                    : new Date(b.time) - new Date(a.time);
            });
            setOrders(sortedOrders);
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        };

        const [orders, setOrders] = useState(buyState.msgs.concat(sellState.msgs));
        const [sortOrder, setSortOrder] = useState("asc");
        const [checkBoxContainerState, setCheckBoxContainerState] = useState(false);

        const sumTotal = () => {
            let sum = 0;
            orders.map(order => {
                if(order.type === "SELL"){
                    const tp = Number(order.lastPriceValue) - Number(order.price);
                    sum = sum + tp;
                }
            });
            //setTotalSum(sum);
        }

        const sellProfit = useMemo(() => {
            return orders.reduce((sum, order) => {
                if (order.type === "SELL") {
                    return sum + (Number(order.lastPriceValue) - Number(order.price));
                }
                return sum;
            }, 0);
        }, [orders]);

        useEffect(() => {
            const data = buyState.msgs.concat(sellState.msgs);
            setOrders(data);
        }, [sellState.msgs.length, buyState.msgs.length]);

        const handleCollapseButtonClick = () => {
            checkBoxContainerState === true ? setCheckBoxContainerState(false) : setCheckBoxContainerState(true);
        }

        const deleteAllMessages = () => {
            buyState.msgs = [];
            sellState.msgs = [];
            sellState.rootStore.saveStorage();
        };

        return (
            <Draggable>
                <div className="console-box" id="list-order-panel" hidden={buyPanelState.stopAllAction}>
                    <div className="tab-container">
                        <span className="activeTime">
                           <span
                               className="panelTitle">Orders list</span>, active time: {buyPanelState.active.timeDiff} min.
                        </span>
                        <button className="exit-button"
                                onClick={() => handleCollapseButtonClick()}>
                            {checkBoxContainerState === true ? "▼" : "▲"}
                        </button>
                        <button onClick={deleteAllMessages}>Delete MSG
                        </button>
                        <div hidden={checkBoxContainerState}>
                            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-sm">
                                <table className="min-w-full bg-white">
                                    <thead className="sticky top-0 bg-gray-100 z-10">
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2">Type</th>
                                        <th className="border px-4 py-2">Name</th>
                                        <th className="border px-4 py-2">Last price</th>
                                        <th className="border px-4 py-2">Last RSI</th>
                                        <th className="border px-4 py-2">Aspect correlation</th>
                                        <th className="border px-4 py-2">Correlation</th>
                                        <th className="border px-4 py-2 cursor-pointer" onClick={sortByDate}>
                                            Date {sortOrder === "asc" ? "▲" : "▼"}
                                        </th>
                                        <th className="border px-4 py-2">Quantity</th>
                                        <th className="border px-4 py-2">Price</th>
                                        <th className="border px-4 py-2">Aspect RSI</th>
                                        <th className="border px-4 py-2">Stop lost</th>
                                        <th className="border px-4 py-2">Take prof</th>
                                        <th className="border px-4 py-2">Earned</th>
                                        <td className="border px-4 py-2">Bullish</td>
                                        <td className="border px-4 py-2">Bearish</td>
                                        <td className="border px-4 py-2">Sinus</td>
                                        <td className="border px-4 py-2">Divrg</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(order => (
                                        <tr className="border">
                                            <td className="border px-4 py-2">{order.type}</td>
                                            <td className="border px-4 py-2">{order.name}</td>
                                            <td className="border px-4 py-2">{order.lastPriceValue}</td>
                                            <td className="border px-4 py-2">{order.lastRSIValue}</td>
                                            <td className="border px-4 py-2">{order.aspectCorrelation}</td>
                                            <td className="border px-4 py-2">{order.correlation}</td>
                                            <td className="border px-4 py-2">{new Date(order.time).toLocaleTimeString()}</td>
                                            <td className="border px-4 py-2">{order.quantity}</td>
                                            <td className="border px-4 py-2">{order.type === "SELL" ? order.price : ""}</td>
                                            <td className="border px-4 py-2">{order.type === "BUY" ? order.rsi : ""}</td>
                                            <td className="border px-4 py-2">{order.type === "SELL" ? order.stopLost : ""}</td>
                                            <td className="border px-4 py-2">{order.type === "SELL" ? order.takeProf : ""}</td>
                                            <td className="border px-4 py-2">{order.type === "SELL" ? Number(order.lastPriceValue - order.price).toFixed(2) : ""}</td>
                                            <td className="border px-4 py-2">{order.bullishLineCorrelation}</td>
                                            <td className="border px-4 py-2">{order.bearishLineCorrelation}</td>
                                            <td className="border px-4 py-2">{order.sinusoidCorrelation}</td>
                                            <td className="border px-4 py-2">{order.divergence}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-2 font-semibold">
                                Bendra suma: {sellProfit.toFixed(2)} €
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }));

export default OrderList;

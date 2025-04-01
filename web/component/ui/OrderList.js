import React, {useState, useEffect} from "react";
import {inject, observer} from "mobx-react";

const OrderList = inject("buyState", "sellState")(
    observer(({buyState, sellState}) => {
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
        const [sortOrder, setSortOrder] = useState("desc");

        useEffect(() => {
            const data = buyState.msgs.concat(sellState.msgs);
            setOrders(data);
            sortByDate("desc");
        }, [sellState.msgs.length, buyState.msgs.length]);



        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Užsakymų sąrašas</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
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
        );
    }));

export default OrderList;

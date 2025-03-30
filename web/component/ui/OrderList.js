import React, { useState, useEffect } from "react";
import {inject, observer} from "mobx-react";

const OrderList = inject("buyState", "sellState", "indicatorReadState")(
    observer(({buyState,sellState,indicatorReadState}) => {

        const [buyOrders, setBuyOrders] = useState([]);
        const [sellOrders, setSellOrders] = useState([]);

            useEffect(() => {
                setBuyOrders(buyState.msgs);
                setSellOrders(sellState.msgs);
            }, [sellState.msgs, buyState.msgs]);

        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Užsakymų sąrašas</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">type</th>
                        <th className="border px-4 py-2">lastPriceValue</th>
                        <th className="border px-4 py-2">lastRSIValue</th>
                        <th className="border px-4 py-2">targetPrice</th>
                        <th className="border px-4 py-2">aspectCorrelation</th>
                        <th className="border px-4 py-2">correlation</th>
                        <th className="border px-4 py-2">time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {buyOrders.map(order => (
                        <tr className="border">
                            <td className="border px-4 py-2">BUY</td>
                            <td className="border px-4 py-2">{order.lastPriceValue}</td>
                            <td className="border px-4 py-2">{order.lastRSIValue}</td>
                            <td className="border px-4 py-2">{order.targetPrice}</td>
                            <td className="border px-4 py-2">{order.aspectCorrelation}</td>
                            <td className="border px-4 py-2">{order.correlation}</td>
                            <td className="border px-4 py-2">{order.time}</td>
                        </tr>
                    ))}
                    {sellOrders.map(order => (
                        <tr className="border">
                            <td className="border px-4 py-2">SELL</td>
                            <td className="border px-4 py-2">{order.lastPriceValue}</td>
                            <td className="border px-4 py-2">{order.lastRSIValue}</td>
                            <td className="border px-4 py-2">{order.targetPrice}</td>
                            <td className="border px-4 py-2">{order.aspectCorrelation}</td>
                            <td className="border px-4 py-2">{order.correlation}</td>
                            <td className="border px-4 py-2">{order.time}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }));

export default OrderList;

import React, {useState, useEffect} from "react";

const TrailingBuy = ({ initialPrice, trailingPercent, onBuy }) => {

    const [lowestPrice, setLowestPrice] = useState(initialPrice);
    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const trailingThreshold = lowestPrice * (1 + trailingPercent / 100);


// Dummy function to simulate fetching market price
    const fetchMarketPrice = () => {
        return Math.random() * (200 - 100) + 100; // Simuliuojame kainų judėjimą tarp 100 ir 200
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const newPrice = fetchMarketPrice(); // Pakeisk šią funkciją realiais rinkos duomenimis
            setCurrentPrice(newPrice);

            if (newPrice < lowestPrice) {
                setLowestPrice(newPrice);
            } else if (newPrice >= trailingThreshold) {
                onBuy(newPrice);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lowestPrice, trailingThreshold, onBuy]);

    return (
        <div>
            <p>Current Price: {currentPrice.toFixed(2)}</p>
            <p>Lowest Price: {lowestPrice.toFixed(2)}</p>
            <p>Trailing Buy Threshold: {trailingThreshold.toFixed(2)}</p>
        </div>
    );
};

export default TrailingBuy;
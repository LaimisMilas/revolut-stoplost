

    let position = {
        entry: 0,
        stop:0,
        target: 0,
        timestamp: 0
    };
    let orders;

    const getPosition = () => {
        return position;
    }

    const setPosition = (pos) => {
        position = pos;
    }

    const pushOrder = (order) => {
        orders.push(order);
        if(orders.length > 50){
            orders = orders.slice(-50);
        }
    }


module.exports = {getPosition, setPosition, pushOrder};
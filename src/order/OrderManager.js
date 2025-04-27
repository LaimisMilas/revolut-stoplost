
//placeMarketOrder(symbol, side, quantity)
//Pastato Market Order (pirkimas/pardavimas už rinkos kainą).
//Pvz., „Nupirk SOL/USDT už 100 USDT“.

//placeLimitOrder(symbol, side, quantity, price)
//Pastato Limit Order (už fiksuotą kainą).
//Pvz., „Nupirk SOL, jei kaina nukris iki 140 USDT“.

//placeStopLossOrder(symbol, quantity, stopPrice)
//Pastato Stop Loss orderį (apsauginį orderį).
//Pvz., „Parduoti SOL, jei kaina kris žemiau 135 USDT“.

//placeTakeProfitOrder(symbol, quantity, targetPrice)
//Pastato Take Profit orderį.
//Pvz., „Parduoti SOL, kai kaina pakils iki 150 USDT“.

//cancelOrder(orderId)
//Atšaukia atidėtą orderį (jeigu dar nėra įvykdytas).

//getOpenOrders(symbol)
//Grąžina visus šiuo metu aktyvius (atvirus) orderius tam tikram instrumentui

//getOrderStatus(orderId)
//Patikrina konkretaus orderio būseną: atidarytas, įvykdytas, atšauktas, dalinai įvykdytas.

//modifyOrder(orderId, newPrice, newQuantity)
//Redaguoti jau esantį Limit arba Stop orderį.
//Pvz., koreguoti kainą arba kiekį, jeigu rinka pasikeičia.

//closePosition(symbol)
// Uždaro visą atidarytą poziciją rinkoje (parduoda viską su Market Order).

//setOCOOrder(symbol, quantity, takeProfitPrice, stopLossPrice)
// OCO (One Cancels Other) orderis:
// Automatiškai pastato abu: Take Profit ir Stop Loss, kai vienas suveikia — kitas automatiškai atšaukiamas.
// Pvz., SOL/USDT: Take Profit @ 150, Stop Loss @ 135. Jei Take Profit pasiekia, Stop Loss automatiškai ištrintas.

//calculateOrderSize(riskAmount, stopLossDistance)
// Pagal rizikos valdymą automatiškai paskaičiuoja kiek vienetų pirkti.
// Pvz., jei nori rizikuoti tik 20 USDT, o Stop Loss yra 2% žemiau, sistema paskaičiuoja dydį.

//🔥 Svarbios pastabos dėl Order Manager
// Robustiškumas:
// Jei API užstringa arba ryšys nutrūksta — Order Manager turi atsistatyti, tikrinti orderių statusą.
//
// Error handling:
// Ką daryti, jei birža grąžina klaidą (pvz., „insufficient balance“, „order not found“, „rate limit exceeded“)?
//
// Draudimas „dvigubų orderių“:
// Negali pastatyti 2 identiškų orderių per klaidą.
//
// Reconnect & Recovery:
// Jei sistema nulūžta — restartuojantis reikia patikrinti ar yra atvirų orderių/pozicijų.

//OrderManager
// ├── placeMarketOrder()
// ├── placeLimitOrder()
// ├── placeStopLossOrder()
// ├── placeTakeProfitOrder()
// ├── setOCOOrder()
// ├── cancelOrder()
// ├── getOpenOrders()
// ├── getOrderStatus()
// ├── closePosition()
// └── calculateOrderSize()
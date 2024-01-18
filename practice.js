//This code is practice of promises for an order/inventory system. 
// We require three functions: checkInventory(), processPayment(), shipOrder(). These functions each return a promise.
//checkInventory() expects an order argument and returns a promise. If there are enough items in stock to fill the order, the promise will resolve to an array. The first element in the resolved value array will be the same order and the second element will be the total cost of the order as a number.
//processPayment() expects an array argument with the order as the first element and the purchase total as the second. This function returns a promise. If there is a large enough balance on the giftcard associated with the order, it will resolve to an array. The first element in the resolved value array will be the same order and the second element will be a tracking number.
//shipOrder() expects an array argument with the order as the first element and a tracking number as the second. It returns a promise which resolves to a string confirming the order has shipped.

const store = {
    sunglasses:{
        inventory: 100,
        price: 10.99
    },
    tshirt:{
        inventory: 50,
        price: 19.99
    },
    backpack:{
        inventory: 80,
        price: 44.99
    },
    pants:{
        inventory: 30,
        price: 29.99
    }
}

class customer{
    constructor(name, postalCode) {
        this._name = name;
        this._postalcode = postalCode;
        this._accountbalance = 0;
    }

    set addBalance(amount){
        this._accountbalance += amount;
    }

    set subtractBalance(amount){
        this._accountbalance -= amount;
    }

    get name(){
        return this._name;
    }

    get accountBalance(){
        return this._accountbalance;
    }
}


const customer283 = new customer('Tony', 'L6H2N9');

const order = [['sunglasses', 2], ['tshirt', 1], ['backpack',1], ['pants',1]];

const checkInventory = (order, customer) =>{
    return new Promise((resolve, reject) =>{
        setTimeout(() =>{
            let inStock = order.every(item => store[item[0]].inventory >= item[1]);
            let totalOrderPrice = 0;
            let customerBalance = 0;
            if (inStock){
                order.forEach(item => {totalOrderPrice += (item[1] * store[item[0]].price); })
                customerBalance = customer.accountBalance;
                console.log(`All of the items are in stock. The total cost of the order is $ ${totalOrderPrice}.`);
                console.log('Your Balance is: $' + customerBalance);
                resolve ([order, totalOrderPrice, customer]);
            }else{
                reject('the order could not be completed because some items are sold out.');
            }
        }, 2000);

    })
}

const processPayment = (responseArray) =>{
        const order = responseArray[0];
        const total = responseArray[1];
        const customer = responseArray[2];
    return new Promise((resolve,reject) =>{
        setTimeout(()=>{
            if (customer.accountBalance >= total){
                customer.subtractBalance = total;
                let remainingBalance = customer.accountBalance;
                let trackingNumber = generateTrackingNumber();
                console.log(`Payment of $ ${total} Processed, your remaining balance is $ ${remainingBalance}`);
                resolve ([order, trackingNumber]);
            }else{
                reject('Insufficient Balance, order cancelled.');
            }
        }, 2000);
    })
}


const shipOrder = (responseArray) => {
    const order = responseArray[0];
    const trackingNumber = responseArray[1];
    return new Promise((resolve, reject) =>{
        setTimeout(() =>{
            resolve(`This order has been shipped. Your tracking number is: ${trackingNumber}`);
        }, 2000);
    })
}

function generateTrackingNumber() {
    return Math.floor(Math.random() * 1000000);
}

customer283.addBalance = 200;

checkInventory(order, customer283)
.then((resolvedValueArray)=>{ return processPayment(resolvedValueArray); })
.then((resolvedValueArray) => { return shipOrder(resolvedValueArray);})
.then((successMessage) => { console.log(successMessage);})
.catch((errorMessage) => { console.log(errorMessage);})

//for testing:
//checkInventory(order, customer283);
//processPayment([order, 116.95, customer283]);
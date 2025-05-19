// Step 1: Import the Cashfree SDK

const  Cashfree  = require('cashfree-pg');

// Step 2: Configure Cashfree SDK with API credentials

const paymentHandler = async (amount, order_id, cust_id, phone) => {
  const id =  process.env.CLIENT_ID;
const secret =process.env.CLIENT_SECRET_KEY;
  const options = {
    method: 'POST',
    headers: {
      'x-api-version': '2025-01-01',
      'x-client-id': id,
      'x-client-secret': secret,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_currency: "INR",
      order_amount: amount,
      order_id: order_id,
      customer_details: {
          customer_id: cust_id,
          customer_phone: phone
      }
    })
  };
  
  try {
    const response = await fetch('https://api.cashfree.com/pg/orders', options)
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

module.exports= {paymentHandler};
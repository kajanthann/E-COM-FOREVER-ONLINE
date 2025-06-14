import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// global veriables
const currency = 'inr';
const DeliveryFee = 10;

// payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place Order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    // Validate required fields
    if (!userId || !items || !amount || !address || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod:'COD',
      payment: false,
      status: paymentMethod === 'COD' ? 'Order placed' : 'Payment pending',
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, {cartData: {}});
    

    res.json({
      success: true,
      message: 'Order placed',
    });
    
  } catch (error) {
    console.log('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error placing order',
    });
  }
};

// Placeholder for Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'stripe',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Delivery Fee',
        },
        unit_amount: DeliveryFee * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    return res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// verify stripe 
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    // success might be 'true' string, so compare as string
    if (success === 'true' || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: 'Order placed' });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Admin: Get all orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .sort({ date: -1 }); // Sort by date descending
    res.json({ success: true, orders });
  } catch (error) {
    console.log('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// User: Get their own orders
const userorders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in request'
      });
    }

    const orders = await orderModel.find({ userId })

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Update Order Status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({
      success: true,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.log('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status',
    });
  }
};

export {
  placeOrder,
  allOrders,
  userorders,
  updateStatus,
  placeOrderStripe,
  verifyStripe,
};

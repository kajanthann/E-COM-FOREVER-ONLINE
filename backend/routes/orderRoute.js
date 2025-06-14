import express from 'express';
import {
  allOrders,
  placeOrder,
  updateStatus,
  userorders,
  placeOrderStripe,
  verifyStripe
} from '../controllers/orderController.js';

import authAdmin from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', authAdmin, allOrders);
orderRouter.post('/update-status', authAdmin, updateStatus);

// payment routes
orderRouter.post('/place-order', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);

// user feature
orderRouter.post('/user-orders', authUser, userorders);

orderRouter.post('/verify-stripe',authUser,verifyStripe)


export default orderRouter;
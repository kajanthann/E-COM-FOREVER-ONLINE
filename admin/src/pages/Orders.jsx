import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      if (!token) return;
      const response = await axios.post(
        `${backendUrl}/api/order/update-status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      }
    } catch (error) {
      console.log("Error updating order status:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="container mx-auto px-4 md:px-0 py-8">
      <div className="flex gap-3">
        <img
          src={assets.parcel_icon}
          alt="Product"
          className="w-12 h-12 object-cover rounded-lg mx-auto md:mx-0 flex-shrink-0"
        />
        <h2 className="text-3xl font-bold  mb-8">All Orders</h2>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-start gap-6"
            >
              <div className="flex flex-col md:grid md:grid-cols-[auto_1fr_2fr_2fr_2fr] md:gap-6 flex-1 min-w-0">
                {/* All Product Images */}
                <div className="flex  md:grid grid-cols-2 gap-2">
                  {order.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      title={item.name}
                    />
                  ))}
                </div>

                {/* Order Items */}
                <div className="mb-4 md:mb-0 overflow-hidden">
                  <h3 className="text-lg font-semibold mb-1">Order Items</h3>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-700 truncate">
                      {item.name} × {item.quantity} <span>({item.size})</span>
                    </p>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="mb-4 md:mb-0 overflow-hidden">
                  <h3 className="text-lg font-semibold mb-1">Delivery Address</h3>
                  <p className="text-sm text-gray-700 truncate">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-sm text-gray-700 truncate">
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state}, {order.address.country},{" "}
                    {order.address.zipcode}
                  </p>
                  <p className="text-sm text-gray-700 truncate">{order.address.phone}</p>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4 md:mb-0">
                  <div>
                    <p>
                      <strong>Items:</strong> {order.items.length}
                    </p>
                    <p>
                      <strong>Method:</strong> {order.paymentMethod}
                    </p>
                    <p>
                      <strong>Amount:</strong> {currency}
                      {order.amount}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Payment:</strong> {order.payment ? "✅ Done" : "⏳ Pending"}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(order.date).toDateString()}
                    </p>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="mt-4 md:mt-0">
                  <label
                    htmlFor={`status-${index}`}
                    className="block font-medium text-sm mb-1"
                  >
                    Order Status
                  </label>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-sm"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

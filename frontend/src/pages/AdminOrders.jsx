import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const { backendUrl, token, currency, navigate, isAdmin, handleAuthError } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    try {
      if (!token || !isAdmin) {
        toast.error('Unauthorized access');
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/order/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      if (!token || !isAdmin) {
        toast.error('Unauthorized access');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/update-status`,
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Order status updated');
        loadOrders(); // Reload orders to show updated status
      } else {
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      handleAuthError(error);
    }
  };

  // Load orders when token or admin status changes
  useEffect(() => {
    if (token && isAdmin) {
      loadOrders();
    }
  }, [token, isAdmin]);

  // Redirect if not admin
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login');
    }
  }, [token, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading orders...</p>
      </div>
    );
  }

  if (!token || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mb-6">
        <Title text1="ADMIN" text2="ORDERS" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Items</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order._id.slice(-6)}</td>
                <td className="py-2 px-4">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {order.address.firstName} {order.address.lastName}
                </td>
                <td className="py-2 px-4">{order.items.length} items</td>
                <td className="py-2 px-4">
                  {currency}
                  {order.amount}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.payment
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.payment ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Order placed">Order placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders; 
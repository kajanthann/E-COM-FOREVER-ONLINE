import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency, navigate, loading, setLoading } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        toast.error('Please login to view your orders');
        navigate('/login');
        return;
      }
      setLoading(true);

      const response = await axios.post(backendUrl + '/api/order/user-orders',{},{headers: {token}});

      if (response.data.success) {
        const allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;

            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
        
      } else {
        toast.error(response.data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when token changes
  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="border-t pt-16 px-4 sm:px-8 min-h-[60vh] flex items-center justify-center">
        <p className="text-lg">Please login to view your orders</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 px-4 sm:px-8">
      {/* Title */}
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* Order List */}
      <div className="space-y-6">
        {orderData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No orders found</p>
          </div>
        ) : (
          orderData.map((item, index) => (
            <div
              key={`${item.orderId}-${index}`}
              className="py-4 border-t text-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              {/* Left: Image + Info */}
              <div className="flex items-start gap-4 text-sm">
                <img
                  className="w-20 h-20 object-cover"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div>
                  <p className="text-base font-medium">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-base text-gray-700">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date:{' '}
                    <span className="text-gray-500">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment:{' '}
                    <span className="text-gray-500">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              <div>
                <div className={`flex items-center gap-2 ${item.status === 'Delivered' ? 'bg-green-200' : 'bg-yellow-200'} px-3 py-1 rounded-2xl`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <p>{item.status}</p>
                </div>
              </div>

              {/* Right: Status + Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 text-sm sm:text-base">
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 rounded-sm hover:bg-black hover:text-white transition"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

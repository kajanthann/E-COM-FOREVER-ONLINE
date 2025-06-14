import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentVerify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'failed'

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/verify-stripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        setStatus("success");
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      } else {
        setStatus("failed");
        setTimeout(() => {
          navigate("/cart");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setStatus("failed");
      setTimeout(() => {
        navigate("/cart");
      }, 3000);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6 rounded shadow-md bg-white w-full max-w-md">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-700">Verifying your payment...</h2>
            <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your order.</p>
          </>
        )}

        {status === "success" && (
          <>
            <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="Success" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-600">Payment Verified!</h2>
            <p className="text-gray-500 mt-2">Redirecting to your orders page...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <img src="https://cdn-icons-png.flaticon.com/512/463/463612.png" alt="Failed" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
            <p className="text-gray-500 mt-2">Redirecting back to cart...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;

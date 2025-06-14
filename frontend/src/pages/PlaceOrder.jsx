import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandle = async (event) => {
    event.preventDefault();

    try {
      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          const qty = cartItems[itemId][size];
          if (qty > 0) {
            const product = structuredClone(products.find((p) => p._id === itemId));
            if (product) {
              product.size = size;
              product.quantity = qty;
              orderItems.push(product);
            }
          }
        }
      }
      console.log(orderItems);
      

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(`${backendUrl}/api/order/place-order`,orderData,{headers: {token},});
          console.log(response.data);
          
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message || "Failed to place order");
          }
          break;
        
        case 'stripe':
          const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`,orderData,{headers: {token},});
          if (responseStripe.data.success) {
            const {session_url} = responseStripe.data;
            window.location.replace(session_url);
          }else{
            toast.error(responseStripe.data.message);
          }
          break;

        default:
          break;
      }

    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandle}
      className="flex flex-col lg:flex-row justify-between gap-20 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8"
    >
      {/* Delivery Info */}
      <div className="flex flex-col gap-4 w-full lg:w-1/2">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input required onChange={onchangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-2 px-3 w-full" type="text" placeholder="First Name" />
          <input required onChange={onchangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-2 px-3 w-full" type="text" placeholder="Last Name" />
        </div>

        <input required onChange={onchangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-2 px-3 w-full" type="email" placeholder="Email Address" />
        <input required onChange={onchangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-2 px-3 w-full" type="text" placeholder="Street" />

        <div className="flex flex-col sm:flex-row gap-3">
          <input required onChange={onchangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded py-2 px-3 w-full" type="text" placeholder="City" />
          <input required onChange={onchangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded py-2 px-3 w-full" type="text" placeholder="State" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input required onChange={onchangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded py-2 px-3 w-full" type="number" placeholder="Zipcode" />
          <input required onChange={onchangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded py-2 px-3 w-full" type="text" placeholder="Country" />
        </div>

        <input required onChange={onchangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded py-2 px-3 w-full" type="tel" placeholder="Phone" />
      </div>

      {/* Payment & Summary */}
      <div className="w-full lg:w-1/2 lg:mt-20">
        <CartTotal />

        <div className="mt-10 lg:mt-7">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex flex-col lg:flex-row gap-4 ">
            <div onClick={() => setMethod("stripe")} className="flex items-center gap-3 border p-3 cursor-pointer rounded">
              <p className={`w-4 h-4 border border-gray-400 rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-2" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div onClick={() => setMethod("cod")} className="flex items-center gap-3 border p-3 cursor-pointer rounded">
              <p className={`w-4 h-4 border border-gray-400 rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></p>
              <p className="text-gray-700 text-sm font-medium mx-2">Cash On Delivery</p>
            </div>
          </div>


          <div className="w-full text-end mt-6">
            <button type="submit" className="bg-black text-white px-10 py-3 text-sm rounded hover:bg-gray-800 transition">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

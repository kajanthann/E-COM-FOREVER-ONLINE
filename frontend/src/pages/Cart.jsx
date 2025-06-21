import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, loading } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  const incrementQuantity = (itemId, size, currentQty) => {
    updateQuantity(itemId, size, currentQty + 1);
  };

  const decrementQuantity = (itemId, size, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(itemId, size, currentQty - 1);
    }
  };

  useEffect(() => {
    const tempData = [];
    if (cartItems && Object.keys(cartItems).length > 0) {
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            tempData.push({
              _id: productId,
              size: size,
              quantity: cartItems[productId][size],
            });
          }
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14">
        <div className="text-2xl mb-3">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>
        <div className="text-center py-10">
          <p className="text-gray-500">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-black text-white text-sm px-8 py-3"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3 border-b">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt={productData.name}
                />
                <div>
                  <div className="flex items-center gap-5 mt-2 ">
                    <p>{productData.name}</p>
                    <p className="px-1 sm:px-2 sm:py-1 text-xs border bg-gray-100 border-gray-400">
                      {item.size}
                    </p>
                  </div>
                  <p className="text-xs sm:text-lg font-medium">
                    {currency}
                    {productData.price}
                  </p>
                </div>
              </div>

              {/* cart */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    decrementQuantity(item._id, item.size, item.quantity)
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-pink-300 bg-pink-100 hover:bg-pink-200 transition"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <div className="w-12 text-center bg-pink-50 rounded-2xl shadow-inner select-none py-1">
                  {item.quantity}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    incrementQuantity(item._id, item.size, item.quantity)
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-pink-300 bg-pink-100 hover:bg-pink-200 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove item"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

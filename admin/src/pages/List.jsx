import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchLest = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

const removeProduct = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this product?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="px-2 py-1 text-white bg-red-600 rounded"
            onClick={async () => {
              try {
                const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
                if (response.data.success) {
                  toast.success(response.data.message);
                  await fetchLest();
                } else {
                  toast.error(response.data.message);
                }
              } catch (error) {
                toast.error(error.message);
              }
              closeToast(); // close this confirmation toast
            }}
          >
            Yes
          </button>
          <button
            className="px-2 py-1 bg-gray-300 rounded"
            onClick={closeToast}
          >
            No
          </button>
        </div>
      </div>
    ),
    { autoClose: false } // prevent it from closing automatically
  );
};


  useEffect(() => {
    fetchLest();
  }, []);

  

  return (
    <>
      <p className="mb-2 text-lg font-semibold">All Products List ({list.length})</p>
      <div className="flex flex-col gap-2">

        {/* List table Title for desktop */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 font-semibold">
          <p>Image</p>
          <p>Name</p>
          <p>Qty</p>
          <p>Category</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {/* Product List Items */}
        {list.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 border p-2 rounded-md flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] md:items-center md:px-4 md:py-2"
          >
            {/* Mobile view */}
            <div className="flex items-center md:hidden mb-2">
              <img className="w-16 h-16 object-cover rounded" src={item.image[0]} alt="product" />
              <div className="flex w-full justify-evenly">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p>{item.quantity}</p>
                    <p className="">
                      {currency}
                      {item.price}
                    </p>
                <button
                        onClick={() => removeProduct(item._id)}
                        className="text-red-600 md:block font-bold text md:text-center hover:underline"
                      >
                        X
                      </button>
              </div>
            </div>

            {/* Desktop view */}
            <img
              className="w-20 h-20 object-cover rounded hidden md:block"
              src={item.image[0]}
              alt=""
            />
            <p className="hidden md:block">{item.name}</p>
            <p>{item.quantity}</p>
            <p className="hidden md:block">{item.category}</p>
            
            <p className="hidden md:block">
              {currency}
              {item.price}
            </p>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-600 hidden md:block font-bold text md:text-center hover:underline"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;

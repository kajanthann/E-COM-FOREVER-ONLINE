import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Related from '../components/Related';

const Product = () => {
  const { productId } = useParams();
  const { products,currency,addToCart,loading } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image[0]); // Set the first image by default
    }
  }, [productId, products]);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [productId]);

if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex flex-col sm:flex-row gap-6'>
        {/* Product Images */}
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-2/3'>
          {/* Thumbnail Images */}
          <div className='flex sm:flex-col gap-3 sm:gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] sm:min-w-[100px]'>
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                className={`w-20 h-20 object-cover cursor-pointer border ${
                  item === image ? 'border-black' : 'border-gray-300'
                }`}
                src={item}
                alt={`Thumbnail ${index}`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className='flex-1 flex items-center justify-center'>
            <img
              className='w-full max-h-[600px] object-contain'
              src={image}
              alt='Main'
            />
          </div>
        </div>

        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='text-2xl font-medim mt-3'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} className='w-3 5' alt="" />
              <img src={assets.star_icon} className='w-3 5' alt="" />
              <img src={assets.star_icon} className='w-3 5' alt="" />
              <img src={assets.star_icon} className='w-3 5' alt="" />
              <img src={assets.star_dull_icon} className='w-3 5' alt="" />
              <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium text-gray-700 mb-2'>Price:{currency} {productData.price}</p>
          <p className='text-sm text-gray-500 mt-5'>Category: {productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-3 '>
                {productData.size.map((item,index) => (
                  <button onClick={() => setSize(prev => prev === item ? '' : item)} className={`py-2 px-4 border cursor-pointer border-gray-500 bg-gray-50 ${item === size ? 'bg-pink-200 border-pink-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
          </div>
          <button onClick={() => addToCart(productData._id,size)} className='bg-black cursor-pointer text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
          </div>
          <p className='text-sm text-gray-500 mb-4'>Category: {productData.category}</p>
          <p className='text-sm text-gray-500'>Type: {productData.subCategory}</p>
        </div>
      </div>

      {/* discription and review */}
      <div className='mt-20'>
                <div className='flex'>
                <b className='border px-5 py-3 text-sm'>Description</b>
                <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
                </div>
                <div className='flex flex-col gap-4 border p-6 text-sm text-gray-500'>
                    <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
                    <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
                </div>
      </div>

      {/* display related products */}
      <Related category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className='opacity-0'>Loading...</div>
  );
};

export default Product;

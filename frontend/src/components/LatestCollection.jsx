import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);
  const [latestPro, setLatestPro] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestPro(products.slice(0, 10));
    }
  }, [products]);

  if (loading) {
    return (
      <div className="my-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={'Latest'} text2={'Collections'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover the newest additions to our store. Handpicked for quality and style.
        </p>
      </div>

      {latestPro.length === 0 ? (
        <div className="text-center text-gray-500 text-sm">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
          {latestPro.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;

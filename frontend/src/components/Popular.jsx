import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const PopularProduct = () => {
  const { products, loading, getReviewSummary } = useContext(ShopContext);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      const reviewedProducts = await Promise.all(
        products.map(async (product) => {
          const summary = await getReviewSummary(product._id);
          return { ...product, totalReviews: summary.totalReviews };
        })
      );

      const sorted = reviewedProducts
        .filter((item) => item.totalReviews > 0)
        .sort((a, b) => b.totalReviews - a.totalReviews)
        .slice(0, 5); // Top 5

      setPopularProducts(sorted);
    };

    if (products.length > 0) {
      fetchPopularProducts();
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
      <div className="text-center text-3xl py-8">
        <Title text1="MOST" text2="POPULAR" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Top-rated products based on customer reviews and popularity.
        </p>
      </div>

      {popularProducts.length === 0 ? (
        <div className="text-center text-gray-500 text-sm">
          No popular products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {popularProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularProduct;

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Stars from './Stars';

const ProductCard = ({ id, name, image, price }) => {
  const { backendUrl, currency, getReviewSummary } = useContext(ShopContext);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
  const fetchSummary = async () => {
    const summary = await getReviewSummary(id);
    setAvgRating(summary.averageRating);
    setTotalReviews(summary.totalReviews);
  };
  fetchSummary();
}, [id, getReviewSummary]);


  return (
    <Link
      to={`/product/${id}`}
      className="block p-2 rounded-md shadow-md transition duration-300 ease-in-out bg-slate-50"
    >
      <div className="overflow-hidden rounded-md">
        <img
          className="w-full sm:w-64 h-40 md:h-48 object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-105"
          src={image[0]}
          alt={name}
        />
      </div>

      {/* Info Row */}
      <div className="pt-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
          <p className="text-sm text-gray-600">
            {currency}
            {price}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <Stars rating={avgRating} />
          <span className="text-xs text-gray-500 mt-1">
            ({avgRating.toFixed(1)}) / {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

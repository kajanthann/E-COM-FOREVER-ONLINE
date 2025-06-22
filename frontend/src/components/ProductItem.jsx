import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Stars from './Stars';
import axios from 'axios';

const ProductCard = ({ id, name, image, price }) => {
  const { backendUrl, calculateAverageRating, currency } = useContext(ShopContext);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/review/${id}`);
        if (res.data.success) {
          const avg = calculateAverageRating(res.data.reviews);
          setAvgRating(avg);
        }
      } catch (err) {
        console.error('Failed to fetch average rating:', err);
      }
    };

    fetchRating();
  }, [id, backendUrl, calculateAverageRating]);

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
          <p className="text-sm text-gray-600">{currency}{price}</p>
        </div>

        <div className="flex flex-col items-end">
          <Stars rating={avgRating} />
          <span className="text-xs text-gray-500 mt-1">
            ({avgRating.toFixed(1)})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

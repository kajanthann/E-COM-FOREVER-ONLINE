import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes('collection'));
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t text-center py-6 animate-fade-in">
      <div className="relative w-11/12 sm:w-1/2 mx-auto">
        {/* Animated Border */}
        {/* <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500 animate-border-wave z-0"></div> */}

        {/* Input Container */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm">
          <img src={assets.search_icon} className="w-4 opacity-70" alt="search" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm px-2 bg-transparent placeholder:text-gray-400"
            type="text"
            placeholder="Search for products"
          />

          <img
            onClick={() => setShowSearch(false)}
            className="w-4 cursor-pointer opacity-60 hover:opacity-100 transition"
            src={assets.cross_icon}
            alt="close"
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default Searchbar;

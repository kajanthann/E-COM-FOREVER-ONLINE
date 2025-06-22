import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Related from "../components/Related";
import ReviewSection from "../components/ReviewSelection";
import Stars from "../components/Stars";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, loading } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image[0]);
    }
  }, [productId, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/review/${productId}`);
      const data = res.data;
      if (data.success) {
        setReviewData(data.reviews);
        setAverageRating(parseFloat(data.averageRating));
        setTotalReviews(data.totalReviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  if (loading || !productData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Images */}
        <div className="flex flex-col-reverse sm:flex-row-reverse gap-4 w-full sm:w-2/3">
          {/* Thumbnail List */}
          <div className="flex flex-row sm:flex-col gap-3 sm:gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] sm:min-w-[100px]">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                className={`w-20 h-20 object-cover cursor-pointer border ${
                  item === image ? "border-black" : "border-gray-300"
                }`}
                src={item}
                alt={`Thumbnail ${index}`}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center">
            <img
              className="w-full max-h-[600px] object-contain"
              src={image}
              alt="Main"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium mt-3">{productData.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Stars rating={averageRating} />
            <span className="text-lg font-bold">
              {averageRating.toFixed(1)}
            </span>
            <p className="text-xs text-gray-600">({totalReviews})</p>
          </div>
          <p className="mt-5 text-3xl font-medium text-gray-700 mb-2">
            Price: {currency} {productData.price}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-3">
              {productData.size.map((item, index) => (
                <button
                  onClick={() => setSize((prev) => (prev === item ? "" : item))}
                  className={`py-2 px-4 border cursor-pointer border-gray-500 bg-gray-50 ${
                    item === size ? "bg-pink-200 border-pink-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black cursor-pointer text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
            <p>Category: {productData.category}</p>
            <p>Type: {productData.subCategory}</p>
          </div>
        </div>
      </div>

      {/* Description + Reviews Section */}
      <div className="mt-20">
        {/* Submit Review Section */}
        <ReviewSection
          productId={productData._id}
          onNewReview={() => fetchReviews()}
        />
      </div>

      {/* Related Products */}
      <Related
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;

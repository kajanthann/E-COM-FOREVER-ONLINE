import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import axios from "axios";
import Stars from "./Stars";
import { formatDistanceToNow } from "date-fns";

const ReviewSection = ({ productId, productData }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);

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
      console.error("Error loading reviews:", err);
      toast.error("Failed to load reviews");
    }
  };

  const handleSubmit = async () => {
    if (!token) return toast.error("Please login to submit a review");
    if (!comment.trim() || rating === 0)
      return toast.error("Please enter a comment and rating");

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/review/add`,
        { productId, comment, rating },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Review added");
        setComment("");
        setRating(0);
        fetchReviews();
      } else {
        toast.error(res.data.message || "Failed to add review");
      }
    } catch (error) {
      toast.error("Review submit failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (isNaN(date)) return "N/A";
    return formatDistanceToNow(date, { addSuffix: true }).replace(
      /^about /,
      ""
    );
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex-shrink-0">
          Reviews
        </h2>
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1">
          <Stars rating={averageRating} size={20} />
          <span className="text-lg font-medium text-gray-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-gray-600">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </span>
        <span className="text-green-600 text-sm ml-2">
          ✓ All from verified purchases
        </span>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 border p-4 reviews-scrollbar">
        {reviewData.length === 0 ? (
          <p className="text-gray-400 italic text-sm">
            No customer reviews yet.
          </p>
        ) : (
          reviewData.map((rev, i) => (
            <div
              key={rev._id || i}
              className="border border-gray-50 rounded-md p-4 shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-base font-semibold text-pink-600 select-none">
                    {rev.userId?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="font-semibold text-gray-900 text-base select-text">
                    {rev.userId?.name || "User"}
                    <Stars rating={rev.rating} size={18} />
                  </span>
                </div>
                <span className="text-xs text-gray-500 italic select-text">
                  {formatDate(rev.createdAt)}
                </span>
              </div>

              <p className="mt-3 text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Submit Review */}
      <div className="mt-6 pt-4">
        <p className="text-sm mb-1 font-medium">Write your review</p>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((val) => (
            <img
              key={val}
              src={val <= rating ? assets.star_icon : assets.star_dull_icon}
              className="w-5 cursor-pointer"
              onClick={() => setRating(val)}
              alt={val <= rating ? "Filled star" : "Empty star"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setRating(val);
              }}
              aria-label={`Set rating to ${val} star${val > 1 ? "s" : ""}`}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-3 py-2 text-sm rounded"
          rows={3}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-black text-white px-5 py-2 mt-2 text-sm rounded hover:bg-gray-800 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;

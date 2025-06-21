import reviewModel from "../models/reviewModel.js";
import jwt from "jsonwebtoken";

const addReview = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    const token = req.headers.token;

    if (!token) return res.status(401).json({ success: false, message: "Token not provided" });
    if (!productId || !comment || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const newReview = new reviewModel({ productId, comment, rating, userId });
    await newReview.save();

    res.status(201).json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel.find({ productId }).populate('userId', 'name');

    // Calculate average rating
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

    res.json({
      success: true,
      reviews,
      averageRating: averageRating.toFixed(1), // one decimal place
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};


export { addReview, getProductReviews };

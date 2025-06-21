import express from "express";
import { addReview, getProductReviews } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";


const reviewRouter = express.Router();

reviewRouter.post("/add",authUser, addReview); // POST review
reviewRouter.get("/:productId", getProductReviews); // GET reviews for a product

export default reviewRouter;
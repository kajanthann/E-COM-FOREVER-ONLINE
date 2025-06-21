// reviewModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    }
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);


const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;
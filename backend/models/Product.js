const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const priceHistorySchema = new mongoose.Schema({
  price: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },

    image: { type: String, required: true },

    brand: { type: String },

    category: { type: String, required: true },

    countInStock: { type: Number, required: true, default: 0 },

    rating: { type: Number, default: 0 },

    numReviews: { type: Number, default: 0 },

    reviews: [reviewSchema],

    priceHistory: [priceHistorySchema],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
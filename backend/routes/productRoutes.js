const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require("../controllers/productController");

// 🌍 PUBLIC ROUTES

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Add review to product
router.post("/:id/reviews", protect, createProductReview);

// 👑 ADMIN ROUTES (Protected)

// Create product
router.post("/", protect, admin, createProduct);

// Update product
router.put("/:id", protect, admin, updateProduct);

// Delete product
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.route("/")
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;
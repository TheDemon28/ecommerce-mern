const Wishlist = require("../models/Wishlist");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      message: "Server error adding wishlist item",
    });
  }
};

// Get logged-in user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    }).populate("product");

    res.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      message: "Server error fetching wishlist",
    });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    await item.deleteOne();

    res.json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    res.status(500).json({
      message: "Server error removing wishlist item",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
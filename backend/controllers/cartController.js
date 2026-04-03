const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


// 🛒 GET USER CART
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product");

  res.json(cart || { items: [] });
};


// ➕ ADD TO CART
exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const parsedQty = Number(qty);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid productId. Please send a valid product ObjectId.",
    });
  }

  if (!Number.isInteger(parsedQty) || parsedQty < 1) {
    return res.status(400).json({
      message: "Invalid qty. Please send a positive integer.",
    });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].qty += parsedQty;
  } else {
    cart.items.push({ product: productId, qty: parsedQty });
  }

  await cart.save();
  res.json(await cart.populate("items.product"));
};


// ❌ REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    return res.status(400).json({
      message: "Invalid productId. Please send a valid product ObjectId.",
    });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found." });
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
};

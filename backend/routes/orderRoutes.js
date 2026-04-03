const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderDelivered,
} = require("../controllers/orderController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

// 👑 Admin routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id/deliver", protect, admin, markOrderDelivered);

// 👤 Customer routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
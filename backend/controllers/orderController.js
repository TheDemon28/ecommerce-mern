const Order = require("../models/Order");

// 🧾 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    console.log("req.user =", req.user);
    console.log("req.body =", req.body);

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid,
      paidAt,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: isPaid || false,
      paidAt: paidAt || null,
    });

    const createdOrder = await order.save();

    // Clear cart after successful order
    try {
      const Cart = require("../models/Cart");

      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    } catch (err) {
      console.log("Cart clear error:", err);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

// 📦 GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
};

// 📄 GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// 👑 GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

// 🚚 MARK ORDER AS DELIVERED (ADMIN)
exports.markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Mark delivered error:", error);
    res.status(500).json({
      message: "Failed to mark order as delivered",
    });
  }
};

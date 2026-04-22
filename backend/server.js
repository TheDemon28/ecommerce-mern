const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const supportRoutes = require("./routes/supportRoutes");

const connectDB = require("./config/db");

// 🔥 IMPORT ROUTES
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,https://techkart-f8ef7.web.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// 🔥 CONNECT DATABASE
connectDB();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// 🌍 HEALTH ROUTES
app.get("/", (req, res) => {
  res.send("API running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "connecting",
  });
});

// 🔐 USER ROUTES
app.use("/api/users", userRoutes);

// 📦 PRODUCT ROUTES
app.use("/api/products", productRoutes);

//Cart route
app.use("/api/cart", cartRoutes);

//Order route
app.use("/api/orders", orderRoutes);

//upload route
app.use("/api/upload", uploadRoutes);

//support route
app.use("/api/support", supportRoutes);

app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 2001;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

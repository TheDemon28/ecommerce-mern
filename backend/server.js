const express = require("express");
const cors = require("cors");
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

// 🔥 CONNECT DATABASE
connectDB();

app.use(cors());
app.use(express.json());

// 🌍 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running...");
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

const PORT = process.env.PORT || 2001;

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);

app.use("/api/wishlist", wishlistRoutes);
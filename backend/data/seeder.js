const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const products = require("./products");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products Seeded");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
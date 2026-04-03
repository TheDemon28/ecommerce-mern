const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const Product = require("../models/Product");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadAllImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const products = await Product.find();

    for (const product of products) {
      console.log(`Uploading: ${product.name}`);

      const result = await cloudinary.uploader.upload(product.image, {
        folder: "mern-store-products",
        public_id: product.name.replace(/\s+/g, "-").toLowerCase(),
      });

      product.image = result.secure_url;
      await product.save();

      console.log(`Updated ${product.name}`);
      console.log(result.secure_url);
    }

    console.log("✅ All product images uploaded to Cloudinary");
    process.exit();
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    process.exit(1);
  }
}

uploadAllImages();
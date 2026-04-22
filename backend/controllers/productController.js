const Product = require("../models/Product");

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 🔥 GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;

    const filter = {};

    // Search by product name or category
    if (req.query.keyword) {
      const keyword = escapeRegex(req.query.keyword.trim());

      filter.$or = [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Category filter from category cards
    if (req.query.category) {
      const category = escapeRegex(req.query.category.trim());

      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (req.query.sort === "priceLow") {
      sortOption = { price: 1 };
    } else if (req.query.sort === "priceHigh") {
      sortOption = { price: -1 };
    } else if (req.query.sort === "rating") {
      sortOption = { rating: -1 };
    }

    const [count, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .select(
          "name price image brand category countInStock rating numReviews createdAt"
        )
        .sort(sortOption)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean(),
    ]);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Server error fetching products",
    });
  }
};

// 🔥 GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Server error fetching product",
    });
  }
};

// 🔥 CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      brand,
      countInStock,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !category ||
      !brand
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      image,
      category,
      brand,
      countInStock: countInStock || 0,
      user: req.user._id,

      // Save first price in history
      priceHistory: [
        {
          price: Number(price),
          date: new Date(),
        },
      ],
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Server error creating product",
    });
  }
};

// 🔥 UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;

    // Save old price before changing
    if (
      req.body.price !== undefined &&
      Number(req.body.price) !== product.price
    ) {
      product.priceHistory.push({
        price: product.price,
        date: new Date(),
      });

      product.price = Number(req.body.price);
    }

    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.countInStock =
      req.body.countInStock ?? product.countInStock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Server error updating product",
    });
  }
};

// 🔥 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Server error deleting product",
    });
  }
};

// 🔥 CREATE PRODUCT REVIEW
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) =>
        review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      message: "Server error creating review",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import RecentlyViewed from "./RecentlyViewed";
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Product() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [inWishlist, setInWishlist] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

        const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

const updatedRecent = [
  data._id,
  ...recent.filter((item) => item !== data._id),
].slice(0, 10);

localStorage.setItem(
  "recentlyViewed",
  JSON.stringify(updatedRecent)
);

        const token = localStorage.getItem("token");

        if (token) {
          try {
            const wishlistRes = await API.get("/wishlist", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const exists = wishlistRes.data.some(
              (item) => item.product._id === data._id,
            );

            setInWishlist(exists);
          } catch (err) {
            console.error("Wishlist fetch error:", err);
          }
        }

        const related = await API.get(
          `/products?category=${encodeURIComponent(data.category)}`,
        );

        setRelatedProducts(
          related.data.products.filter((p) => p._id !== data._id).slice(0, 4),
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await API.post(
        "/cart",
        {
          productId: product._id,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchCart();
      alert("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(
        "Failed to add to cart: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      setReviewLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        `/products/${product._id}/reviews`,
        {
          rating: reviewRating,
          comment: reviewComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { data } = await API.get(`/products/${id}`);
      setProduct(data);

      setReviewComment("");
      setReviewRating(5);

      alert("Review submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-xl">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Product not found.
      </div>
    );
  }

  const defaultReviews = [
    {
      _id: "default-1",
      name: "Rahul",
      rating: 5,
      comment: "Amazing quality and fast delivery. Worth every rupee!",
      createdAt: new Date(),
    },
    {
      _id: "default-2",
      name: "Priya",
      rating: 4,
      comment:
        "Really liked the product. Packaging and quality were excellent.",
      createdAt: new Date(),
    },
    {
      _id: "default-3",
      name: "Aman",
      rating: 5,
      comment: "One of the best purchases I've made recently.",
      createdAt: new Date(),
    },
  ];

  const mergedReviews = [...(product.reviews || []), ...defaultReviews];

  const allPrices = [
    ...(product.priceHistory || []).map((item) => item.price),
    product.price,
  ];

  const lowestPrice = Math.min(...allPrices);
  const highestPrice = Math.max(...allPrices);

  const priceDifference = highestPrice - product.price;

  const priceDropPercent =
    highestPrice > 0 ? Math.round((priceDifference / highestPrice) * 100) : 0;

  const isBestPrice = product.price === lowestPrice;

  const chartData = [
    ...(product.priceHistory || [])
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        price: item.price,
      })),
    {
      date: "Now",
      price: product.price,
    },
  ];

  const toggleWishlist = async () => {
  try {
    setWishlistLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (inWishlist) {
      await API.delete(`/wishlist/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInWishlist(false);
    } else {
      await API.post(
        "/wishlist",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInWishlist(true);
    }

    const { data } = await API.get("/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.dispatchEvent(
      new CustomEvent("wishlistUpdated", {
        detail: data.length,
      })
    );
  } catch (error) {
    console.error("Wishlist error:", error);
    alert(error.response?.data?.message || "Failed to update wishlist");
  } finally {
    setWishlistLoading(false);
  }
};
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-800">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[450px] object-contain rounded-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold text-slate-900">
              {product.name}
            </h1>

            <p className="mt-2 text-slate-500 text-lg">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={20} fill="currentColor" />
              <span className="font-semibold text-slate-800">
                {product.rating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <span className="text-slate-500">
              ({mergedReviews.length} reviews)
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-slate-500 text-sm">Special Price</p>
                <h2 className="mt-2 text-3xl font-bold text-indigo-600">
                  ₹{product.price}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {isBestPrice && (
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                      Best Price So Far 🎉
                    </span>
                  )}

                  {priceDropPercent > 0 && (
                    <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                      {priceDropPercent}% lower than highest price
                    </span>
                  )}

                  {lowestPrice < product.price && (
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                      Lowest recorded: ₹{lowestPrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition ${
                  inWishlist
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-300 hover:bg-slate-100 text-slate-600"
                } ${wishlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {product.priceHistory?.length > 0 && (
              <div className="mt-6 grid md:grid-cols-5 gap-4">
                <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    Price Trend
                  </h3>

                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          domain={["dataMin", "dataMax"]}
                        />
                        <Tooltip
                          formatter={(value) => [`₹${value}`, "Price"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#4f46e5"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    Recent Changes
                  </h3>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div className="flex justify-between rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                      <span className="text-sm font-medium text-emerald-700">
                        Now
                      </span>
                      <span className="font-bold text-emerald-700">
                        ₹{product.price}
                      </span>
                    </div>

                    {product.priceHistory
                      ?.slice()
                      .reverse()
                      .slice(0, 4)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between rounded-xl border border-slate-200 p-3"
                        >
                          <span className="text-sm text-slate-500">
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="font-semibold text-slate-800">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {product.countInStock > 0 ? (
              <p className="text-emerald-600 font-semibold text-lg">
                In Stock ({product.countInStock} available)
              </p>
            ) : (
              <p className="text-red-500 font-semibold text-lg">Out of Stock</p>
            )}
          </div>

          {product.countInStock > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">Quantity:</span>

              <div className="flex items-center rounded-2xl border border-slate-300 overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-slate-100"
                >
                  -
                </button>

                <span className="px-5 py-2 font-semibold">{qty}</span>

                <button
                  onClick={() =>
                    setQty(Math.min(product.countInStock, qty + 1))
                  }
                  className="px-4 py-2 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Product Description
            </h3>
            <p className="text-slate-600 leading-7">{product.description}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center shadow-sm">
              <Truck className="mx-auto text-indigo-600 mb-3" size={28} />
              <p className="font-semibold text-slate-800">Free Delivery</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center shadow-sm">
              <RotateCcw className="mx-auto text-indigo-600 mb-3" size={28} />
              <p className="font-semibold text-slate-800">7 Days Return</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center shadow-sm">
              <ShieldCheck className="mx-auto text-indigo-600 mb-3" size={28} />
              <p className="font-semibold text-slate-800">1 Year Warranty</p>
            </div>
          </div>

          <button
            disabled={product.countInStock === 0}
            onClick={addToCart}
            className="w-full py-4 rounded-3xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-lg flex items-center justify-center gap-3 transition"
          >
            <ShoppingCart size={22} />
            Add to Cart
          </button>
        </motion.div>
      </div>

      <div className="mt-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">
              Write a Review
            </h2>

            {user ? (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rating
                  </label>

                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Bad</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Comment
                  </label>

                  <textarea
                    rows="5"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell others what you think..."
                    required
                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-600">
                Please login to write a review.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">
                Customer Reviews
              </h2>

              <span className="text-sm text-slate-500">
                {mergedReviews.length} total reviews
              </span>
            </div>

            {mergedReviews.length > 0 ? (
              <div className="space-y-5">
                {mergedReviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {review.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-700">
                        <Star size={16} fill="currentColor" />
                        {review.rating}
                      </div>
                    </div>

                    <p className="mt-4 leading-7 text-slate-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No reviews yet. Be the first to review this product.
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Similar Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    {item.category}
                  </p>

                  <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px]">
                    {item.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-600">
                      ₹{item.price}
                    </span>

                    <span className="text-sm text-slate-500">
                      ⭐ {item.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <RecentlyViewed />
    </div>
  );
}

export default Product;

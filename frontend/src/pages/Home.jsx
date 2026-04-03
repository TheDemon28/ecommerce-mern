import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const categories = [
    { name: "Mobiles", icon: "📱" },
    { name: "Laptops", icon: "💻" },
    { name: "Headphones", icon: "🎧" },
    { name: "Shoes", icon: "👟" },
    { name: "Clothing", icon: "👕" },
    { name: "TVs", icon: "📺" },
    { name: "Speakers", icon: "🔊" },
    { name: "Watches", icon: "⌚" },
    { name: "Gaming", icon: "🎮" },
    { name: "Cameras", icon: "📷" },
    { name: "Tablets", icon: "📱" },
  ];

  useEffect(() => {
    setPage(1);
  }, [keyword, category, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get(
          `/products?page=${page}&keyword=${keyword}&category=${category}&sort=${sort}`,
        );

        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [page, keyword, category, sort]);

  const getVisiblePages = () => {
    const visible = [];

    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) {
        visible.push(i);
      }
    } else {
      visible.push(1);

      if (page > 3) visible.push("...");

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(pages - 1, page + 1);
        i++
      ) {
        visible.push(i);
      }

      if (page < pages - 2) visible.push("...");

      visible.push(pages);
    }

    return visible;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl p-6"
    >
      {/* HERO SECTION */}
      <div className="mb-10 flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl lg:flex-row">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
            Shop Smart, Shop Fast 🚀
          </h1>

          <p className="mt-4 text-lg text-indigo-100">
            Discover premium mobiles, laptops, gaming gear, fashion, accessories
            and much more at unbeatable prices.
          </p>

          <button
            onClick={() => {
              document
                .getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-slate-100"
          >
            Explore Categories
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
          alt="Shopping"
          className="w-full max-w-sm rounded-3xl shadow-2xl"
        />
      </div>

      <div id="categories" className="mb-12">
        {/* TOP BAR */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Shop by Category
            </h2>
            <p className="mt-1 text-slate-500">
              Browse products by your favorite category
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-500"
            >
              <option value="">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {(category || sort || keyword) && (
              <button
                onClick={() => {
                  setCategory("");
                  setSort("");
                  navigate("/");
                }}
                className="rounded-2xl bg-indigo-100 px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-200"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setCategory(cat.name);
                setPage(1);
              }}
              className={`rounded-3xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                category === cat.name
                  ? "border-indigo-500 bg-indigo-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-indigo-300"
              }`}
            >
              <div className="mb-3 text-4xl">{cat.icon}</div>

              <p
                className={`font-semibold ${
                  category === cat.name ? "text-indigo-700" : "text-slate-800"
                }`}
              >
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {category
              ? `${category} Products`
              : keyword
                ? `${keyword} Products`
                : "Trending Products 🔥"}
          </h2>

          <p className="mt-1 text-slate-500">
            {category
              ? `Showing ${category} category`
              : keyword
                ? `Showing results for ${keyword}`
                : "Handpicked products for you"}
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Page {page} of {pages}
        </div>
      </div>

      {/* PRODUCT GRID */}
      {products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mb-4 text-6xl">😕</div>

          <h3 className="text-2xl font-bold text-slate-800">
            No products found
          </h3>

          <p className="mt-2 text-slate-500">
            Try another category or search term.
          </p>

          <button
            onClick={() => {
              setCategory("");
              setSort("");
              navigate("/");
            }}
            className="mt-6 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-2xl"
            >
              <div className="overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {product.category}
                  </span>

                  <span className="text-sm text-slate-500">
                    {product.brand}
                  </span>
                </div>

                <h3 className="min-h-[56px] text-lg font-bold text-slate-900 line-clamp-2">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">
                      ₹{product.price}
                    </p>

                    <p className="text-sm text-slate-500">
                      {product.countInStock > 0
                        ? `${product.countInStock} in stock`
                        : "Out of stock"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-yellow-500">
                      ⭐ {product.rating || 0}
                    </p>

                    <p className="text-xs text-slate-400">
                      {product.numReviews || 0} reviews
                    </p>
                  </div>
                </div>

                <Link
                  to={`/product/${product._id}`}
                  className="mt-5 block w-full rounded-2xl bg-indigo-600 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`rounded-2xl px-4 py-2 font-medium transition ${
              page === 1
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "border border-slate-300 bg-white hover:bg-slate-100"
            }`}
          >
            Prev
          </button>

          {getVisiblePages().map((item, index) =>
            item === "..." ? (
              <span
                key={`dots-${index}`}
              >
                ...
              </span>
            ) : (
              <button
                key={`${item}-${index}`}
                onClick={() => setPage(item)}
                className={`w-11 h-11 rounded-2xl font-semibold transition ${
                  page === item
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            disabled={page === pages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`rounded-2xl px-4 py-2 font-medium transition ${
              page === pages
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "border border-slate-300 bg-white hover:bg-slate-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default Home;

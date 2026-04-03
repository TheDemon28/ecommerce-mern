import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids =
          JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        if (ids.length === 0) return;

        const responses = await Promise.all(
          ids
            .filter(Boolean)
            .slice(0, 6)
            .map((id) => API.get(`/products/${id}`))
        );

        setProducts(responses.map((res) => res.data));
      } catch (error) {
        console.error("Recently viewed fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">
          Recently Viewed
        </h2>

        <button
          onClick={() => {
            localStorage.removeItem("recentlyViewed");
            setProducts([]);
          }}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-44 w-full object-cover"
            />

            <div className="p-4">
              <p className="mb-1 text-xs font-medium text-indigo-600">
                {product.category}
              </p>

              <h3 className="line-clamp-2 min-h-[48px] text-sm font-bold text-slate-900">
                {product.name}
              </h3>

              <p className="mt-3 text-lg font-bold text-indigo-600">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
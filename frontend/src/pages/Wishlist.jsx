import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import API from "../services/api";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchCart } = useCart();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(data);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedWishlist = wishlist.filter(
        (item) => item.product._id !== productId,
      );

      setWishlist(updatedWishlist);

      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: updatedWishlist.length,
        }),
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading wishlist...
      </div>
    );
  }

  const moveToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/cart",
        {
          productId,
          qty: 1,
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
      console.error("Move to cart error:", error);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="text-red-500" fill="currentColor" size={30} />
        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <Heart className="mx-auto mb-4 text-slate-300" size={50} />
          <h2 className="text-xl font-semibold text-slate-700">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-slate-500">
            Save products you like and they will appear here.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <Link to={`/product/${item.product._id}`}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-60 w-full object-cover"
                />
              </Link>

              <div className="p-5">
                <p className="mb-2 text-sm font-medium text-indigo-600">
                  {item.product.category}
                </p>

                <Link to={`/product/${item.product._id}`}>
                  <h2 className="line-clamp-2 text-lg font-bold text-slate-900 hover:text-indigo-600">
                    {item.product.name}
                  </h2>
                </Link>

                <p className="mt-3 text-2xl font-bold text-indigo-600">
                  ₹{item.product.price}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => moveToCart(item.product._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>

                  <Link
                    to={`/product/${item.product._id}`}
                    className="rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

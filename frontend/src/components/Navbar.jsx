import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  HeadphonesIcon,
  Menu,
  LogOut,
  Shield,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token || user?.isAdmin) {
          setWishlistCount(0);
          return;
        }

        const { data } = await API.get("/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishlistCount(data.length);

        window.dispatchEvent(
          new CustomEvent("wishlistUpdated", {
            detail: data.length,
          })
        );
      } catch (error) {
        console.error("Wishlist count error:", error);
      }
    };

    const handleWishlistUpdated = (event) => {
      setWishlistCount(event.detail);
    };

    fetchWishlistCount();

    window.addEventListener("wishlistUpdated", handleWishlistUpdated);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
    };
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/?keyword=${search}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setWishlistCount(0);
    setMobileOpen(false);

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="TechKart"
              className="h-12 w-auto object-contain sm:h-14 md:h-16"
            />

            <div className="hidden sm:block leading-none">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                TechKart
              </h1>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Tech, fashion and more
              </p>
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden max-w-2xl flex-1 md:flex"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for mobiles, laptops, shoes..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 py-3 pl-5 pr-14 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

              <button
                type="submit"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-2 lg:flex xl:gap-3">
            <Link
              to={
                user
                  ? user.isAdmin
                    ? "/admin/dashboard"
                    : "/profile"
                  : "/login"
              }
              className="flex items-center gap-3 rounded-2xl px-4 py-2 transition hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                {user?.isAdmin ? <Shield size={20} /> : <User size={20} />}
              </div>

              <div className="text-left">
                <p className="text-xs text-slate-500">
                  {user
                    ? user.isAdmin
                      ? "Administrator"
                      : "Your Account"
                    : "Welcome"}
                </p>

                <p className="text-sm font-semibold text-slate-900">
                  {user ? user.name : "Login / Sign Up"}
                </p>
              </div>
            </Link>

            {!user?.isAdmin && (
              <Link
                to="/support"
                className="flex items-center gap-3 rounded-2xl px-4 py-2 transition hover:bg-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <HeadphonesIcon size={20} />
                </div>

                <div className="text-left">
                  <p className="text-xs text-slate-500">Need Help?</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Support / Contact
                  </p>
                </div>
              </Link>
            )}

            {!user?.isAdmin && (
              <Link
                to="/wishlist"
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50"
              >
                <Heart size={22} />

                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-3 rounded-2xl bg-indigo-600 px-4 py-2 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <div className="relative">
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-indigo-600">
                    {cartCount}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-indigo-100">Your Cart</p>
                <p className="text-sm font-semibold">{cartCount} Items</p>
              </div>
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 transition hover:bg-slate-100"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
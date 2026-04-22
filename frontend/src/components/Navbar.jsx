import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  HeadphonesIcon,
  Menu,
  X,
  LogOut,
  Shield,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import logo from "../assets/logo.png";

const MotionDiv = motion.div;

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = Boolean(user?.isAdmin);
  const accountPath = user
    ? isAdmin
      ? "/admin/dashboard"
      : "/profile"
    : "/login";
  const accountTitle = user
    ? isAdmin
      ? "Administrator"
      : "Your Account"
    : "Welcome";
  const accountSubtitle = user ? user.name : "Login / Sign Up";
  const AccountIcon = isAdmin ? Shield : User;

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token || isAdmin) {
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
  }, [storedUser, isAdmin]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/?keyword=${encodeURIComponent(search.trim())}`);
    closeMobileMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setWishlistCount(0);
    closeMobileMenu();

    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex shrink-0 items-center gap-3"
          >
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
              to={accountPath}
              className="flex items-center gap-3 rounded-2xl px-4 py-2 transition hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <AccountIcon size={20} />
              </div>

              <div className="text-left">
                <p className="text-xs text-slate-500">{accountTitle}</p>

                <p className="text-sm font-semibold text-slate-900">
                  {accountSubtitle}
                </p>
              </div>
            </Link>

            {!isAdmin && (
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

            {!isAdmin && (
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
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-t border-slate-200/70 bg-white lg:hidden"
          >
            <div className="mx-auto max-h-[calc(100vh-5rem)] max-w-7xl overflow-y-auto px-4 pb-4 pt-3 sm:px-6">
              <form onSubmit={handleSearch} className="md:hidden">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-100/80 py-3 pl-4 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="submit"
                    aria-label="Search products"
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700"
                  >
                    <Search size={17} />
                  </button>
                </div>
              </form>

              <nav className="mt-3 grid gap-2 md:mt-0">
                <Link
                  to={accountPath}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-slate-100"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <AccountIcon size={20} />
                  </span>

                  <span className="min-w-0 text-left">
                    <span className="block text-xs text-slate-500">
                      {accountTitle}
                    </span>
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {accountSubtitle}
                    </span>
                  </span>
                </Link>

                {!isAdmin && (
                  <Link
                    to="/support"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-slate-100"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <HeadphonesIcon size={20} />
                    </span>

                    <span className="text-left">
                      <span className="block text-xs text-slate-500">
                        Need Help?
                      </span>
                      <span className="block text-sm font-semibold text-slate-900">
                        Support / Contact
                      </span>
                    </span>
                  </Link>
                )}

                {!isAdmin && (
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between rounded-lg px-3 py-3 transition hover:bg-red-50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <Heart size={20} />
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        Wishlist
                      </span>
                    </span>

                    {wishlistCount > 0 && (
                      <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between rounded-lg bg-indigo-600 px-3 py-3 text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                      <ShoppingCart size={20} />
                    </span>

                    <span className="text-left">
                      <span className="block text-xs text-indigo-100">
                        Your Cart
                      </span>
                      <span className="block text-sm font-semibold">
                        {cartCount} Items
                      </span>
                    </span>
                  </span>

                  {cartCount > 0 && (
                    <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-indigo-600">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-left transition hover:bg-slate-100"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <LogOut size={20} />
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      Logout
                    </span>
                  </button>
                )}
              </nav>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
}

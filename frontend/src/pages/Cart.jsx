import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQty,
  } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shipping = subtotal > 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Your Cart
            </h1>
            <p className="mt-2 text-slate-500">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your bag
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <ShoppingBag size={36} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-slate-500 max-w-md mx-auto">
              Looks like you haven’t added anything yet. Explore our latest products and fill your cart.
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              {cartItems.map((item) => (
                <motion.div
                  key={item.product}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <Link
                      to={`/product/${item.product}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-32 w-32 rounded-2xl border border-slate-200 object-cover"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-indigo-600">
                            {item.category}
                          </p>

                          <Link
                            to={`/product/${item.product}`}
                            className="mt-1 block text-xl font-bold text-slate-900 hover:text-indigo-600 transition"
                          >
                            {item.name}
                          </Link>

                          <p className="mt-2 text-sm text-slate-500">
                            Brand: {item.brand}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            ₹{item.price}
                          </p>
                          <p className="text-sm text-slate-500">
                            each
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center rounded-2xl border border-slate-200 overflow-hidden w-fit">
                          <button
                            onClick={() =>
                              item.qty > 1 &&
                              updateQty(item.product, item.qty - 1)
                            }
                            className="px-4 py-3 hover:bg-slate-100 transition"
                          >
                            <Minus size={18} />
                          </button>

                          <span className="min-w-[56px] text-center font-semibold text-slate-900">
                            {item.qty}
                          </span>

                          <button
                            onClick={() =>
                              updateQty(item.product, item.qty + 1)
                            }
                            className="px-4 py-3 hover:bg-slate-100 transition"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-indigo-600">
                            ₹{item.price * item.qty}
                          </p>

                          <button
                            onClick={() => removeFromCart(item.product)}
                            className="flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={18} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Tax (18%)</span>
                  <span className="font-semibold text-slate-900">
                    ₹{tax}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{total}
                  </span>
                </div>
              </div>

              {shipping === 0 ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  🎉 You unlocked free shipping!
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  Add ₹{5000 - subtotal} more for free shipping.
                </div>
              )}

              <button
                onClick={() => navigate("/checkout", { state: { cart: cartItems, totalPrice: total } })}
                className="mt-6 w-full rounded-2xl bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
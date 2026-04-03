import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, totalPrice } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-10 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur"
            >
              <CheckCircle2 size={56} />
            </motion.div>

            <h1 className="text-4xl font-bold">Order Confirmed!</h1>
            <p className="mt-3 text-lg text-emerald-50">
              Thank you for shopping with TechCart. Your order has been placed successfully.
            </p>
          </div>

          <div className="p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Order ID</p>
                <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                  {orderId}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Amount Paid</p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  ₹{totalPrice}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex items-start gap-4">
                <Package className="mt-1 text-indigo-600" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    What happens next?
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>• Your order is now being processed.</li>
                    <li>• You can track it anytime from My Orders.</li>
                    <li>• You’ll receive delivery updates once it ships.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/my-orders"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700"
              >
                <Package size={20} />
                View My Orders
              </Link>

              <Link
                to="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <ShoppingBag size={20} />
                Continue Shopping
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderSuccess;
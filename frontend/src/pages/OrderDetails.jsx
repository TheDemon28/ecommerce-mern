import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import API from "../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await API.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium text-slate-500">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-red-600">
            {error || "Order not found"}
          </p>

          <button
            onClick={() => navigate("/my-orders")}
            className="mt-6 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Order Details
            </h1>
            <p className="mt-1 text-slate-500">Order #{order._id}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-slate-500">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      order.isPaid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      order.isDelivered
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-2 text-slate-700">
                  <p>{order.shippingAddress?.address}</p>
                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.postalCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment Info
                  </h2>
                </div>

                <div className="space-y-3 text-slate-700">
                  <p>
                    <span className="font-semibold">Method:</span>{" "}
                    {order.paymentMethod?.toUpperCase()}
                  </p>

                  <div className="flex items-center gap-2">
                    {order.isPaid ? (
                      <>
                        <CheckCircle className="text-emerald-600" size={18} />
                        <span className="font-medium text-emerald-700">
                          Paid on{" "}
                          {new Date(order.paidAt).toLocaleDateString("en-IN")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="text-amber-600" size={18} />
                        <span className="font-medium text-amber-700">
                          Payment pending
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <Package size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ordered Products
                </h2>
              </div>

              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?._id || item.product}`}
                        className="text-lg font-bold text-slate-900 transition hover:text-indigo-600"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-slate-500">
                        Quantity: {item.qty}
                      </p>

                      <p className="text-slate-500">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">Subtotal</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Final Summary
            </h2>

            <div className="space-y-4 border-b border-slate-200 pb-6">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Items</span>
                <span className="font-semibold text-slate-900">
                  {order.orderItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Payment</span>
                <span className="font-semibold text-slate-900">
                  {order.paymentMethod?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Status</span>
                <span className="font-semibold text-slate-900">
                  {order.isDelivered ? "Delivered" : "In Transit"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">
                Total Paid
              </span>
              <span className="text-3xl font-bold text-indigo-600">
                ₹{order.totalPrice}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Truck size={20} className="text-indigo-600" />
                <span className="font-medium">
                  {order.isDelivered
                    ? "Your order has been delivered"
                    : "Your order is being processed"}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
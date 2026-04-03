import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { Package, ChevronRight } from "lucide-react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
          <Package size={28} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="mt-1 text-slate-500">
            View all your previous purchases
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Package className="mx-auto mb-4 text-slate-300" size={48} />

          <h2 className="text-2xl font-bold text-slate-800">
            No Orders Yet
          </h2>

          <p className="mt-2 text-slate-500">
            Once you place an order, it will appear here.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-slate-900">
                    {order._id}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">Placed On</p>
                  <p className="font-medium text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="font-bold text-indigo-600">
                      ₹{order.totalPrice}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-center ${
                      order.isPaid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <p className="text-xs">Payment</p>
                    <p className="font-semibold">
                      {order.isPaid ? "Paid" : "Pending"}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-center ${
                      order.isDelivered
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <p className="text-xs">Delivery</p>
                    <p className="font-semibold">
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="space-y-4">
                  {order.orderItems.slice(0, 2).map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Qty: {item.qty}
                        </p>
                      </div>

                      <p className="font-bold text-slate-800">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/order/${order._id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  View Full Order
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
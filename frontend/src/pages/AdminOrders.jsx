import { useEffect, useState } from "react";
import { CheckCircle2, Package, Truck } from "lucide-react";
import API from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders", {
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
  }, [token]);

  const markDelivered = async (id) => {
    try {
      await API.put(
        `/orders/${id}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                isDelivered: true,
                deliveredAt: new Date().toISOString(),
              }
            : order
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to mark order as delivered"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-indigo-400 font-medium mb-2">
            Admin / Orders
          </p>
          <h1 className="text-4xl font-bold">Customer Orders</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-slate-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-800/50 border-b border-slate-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Order ID
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-slate-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                        #{order._id.slice(-8)}
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            {order.user?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-slate-400">
                            {order.user?.email || "No Email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        ₹{order.totalPrice}
                      </td>

                      <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                            <CheckCircle2 size={16} />
                            Delivered
                          </span>
                        ) : order.isPaid ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                            <Truck size={16} />
                            Paid / Shipping
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium">
                            <Package size={16} />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {!order.isDelivered && (
                          <button
                            onClick={() => markDelivered(order._id)}
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl font-medium transition"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

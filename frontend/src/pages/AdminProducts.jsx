import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import API from "../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products || data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-indigo-400 font-medium mb-2">
              Admin / Products
            </p>
            <h1 className="text-4xl font-bold">Manage Products</h1>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-2xl font-semibold transition"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-slate-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-800/50 border-b border-slate-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Product
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Price
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Stock
                    </th>
                    <th className="text-right px-6 py-4 text-slate-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                          />

                          <div>
                            <h3 className="font-semibold text-white">
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {product.brand || "No Brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        ₹{product.price}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.countInStock > 0
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {product.countInStock > 0
                            ? `${product.countInStock} in stock`
                            : "Out of stock"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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

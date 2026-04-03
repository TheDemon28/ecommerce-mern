import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2001/api",
});

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);

        setForm({
          name: data.name || "",
          brand: data.brand || "",
          category: data.category || "",
          price: data.price || "",
          countInStock: data.countInStock || "",
          image: data.image || "",
          description: data.description || "",
        });
      } catch (err) {
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEdit) {
        await API.put(`/products/${id}`, form, config);
      } else {
        await API.post("/products", form, config);
      }

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} product`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-indigo-400 font-medium mb-2">
            Admin / Products
          </p>
          <h1 className="text-4xl font-bold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5"
        >
          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
              required
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
              required
            />

            <input
              type="number"
              name="countInStock"
              placeholder="Stock"
              value={form.countInStock}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 resize-none"
            required
          />

          {form.image && (
            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 border border-slate-700 hover:bg-slate-800 py-3 rounded-2xl font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-2xl font-semibold transition disabled:opacity-50"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

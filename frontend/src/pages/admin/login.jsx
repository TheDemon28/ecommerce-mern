import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/users/login", form);

      // Only admins can login here
      if (!data.isAdmin) {
        return setError("This account is not an admin account");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Admin login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Admin Login
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Login to manage your store
        </p>

        {error && (
          <div className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-semibold transition"
          >
            Login as Admin
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Don’t have an admin account?{" "}
          <Link
            to="/admin/signup"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Admin Signup
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-slate-500">
          Customer?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Customer Login
          </Link>
        </p>
      </div>
    </div>
  );
}

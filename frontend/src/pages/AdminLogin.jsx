import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/users/login", {
        email,
        password,
      });

      if (!data.isAdmin) {
        alert("This account is not an admin account");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("isAdmin", "true");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Login failed: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Admin Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to manage your store dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-600"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an admin account?{" "}
          <Link
            to="/admin/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Admin Signup
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-gray-500">
          Customer?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline"
          >
            Customer Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
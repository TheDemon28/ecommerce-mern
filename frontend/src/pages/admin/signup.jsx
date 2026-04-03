import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:2001/api",
});

export default function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
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
      const { data } = await API.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        adminSecret: form.adminSecret,
      });

      if (!data.isAdmin) {
        return setError("Invalid admin secret");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Admin signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Create Admin Account
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Only authorized users can register as admin
        </p>

        {error && (
          <div className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Admin Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
            required
          />

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

          <input
            type="password"
            name="adminSecret"
            placeholder="Admin Secret"
            value={form.adminSecret}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-3 outline-none focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-semibold transition"
          >
            Create Admin Account
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Already have an admin account?{" "}
          <Link
            to="/admin/login"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Admin Login
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-slate-500">
          Customer?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:underline"
          >
            Customer Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Hash,
  LogOut,
  Lock,
  Phone,
  MapPin,
  Save,
  Package,
} from "lucide-react";
import API from "../services/api";

export default function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");
  const [address, setAddress] = useState(storedUser?.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await API.put(
        "/users/profile",
        {
          name,
          email,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      await API.put(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-80px)] bg-slate-50 p-6"
    >
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <div className="sticky top-24 h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-4xl font-bold text-white shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              {user.name}
            </h1>

            <p className="mt-1 break-all text-slate-500">{user.email}</p>

            <div className="mt-6 w-full space-y-4 border-t border-slate-100 pt-6 text-left">
              <div className="flex items-center gap-3 text-slate-700">
                <Hash size={18} className="text-indigo-600" />
                <span className="break-all font-mono text-xs">
                  {user._id}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <Calendar size={18} className="text-indigo-600" />
                <span className="text-sm">
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              <Link
                to="/my-orders"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Package size={18} />
                My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {(message || error) && (
            <div
              className={`rounded-2xl border px-5 py-4 font-medium ${
                error
                  ? "border-red-200 bg-red-100 text-red-600"
                  : "border-green-200 bg-green-100 text-green-600"
              }`}
            >
              {error || message}
            </div>
          )}

          {/* Account Information */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Account Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <User size={18} />
                  <span className="text-sm">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Mail size={18} />
                  <span className="text-sm">Email Address</span>
                </div>
                <p className="break-all text-lg font-semibold text-slate-900">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <form
            onSubmit={updateProfile}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"
          >
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Edit Profile
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    placeholder="Enter your address"
                    className="w-full resize-none rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Change Password */}
          <form
            onSubmit={changePassword}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"
          >
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Change Password
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              <Lock size={18} />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
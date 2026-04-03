import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, MessageSquare, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  const cards = [
    {
      title: "Manage Products",
      description: "Add, edit and remove products from your store.",
      icon: Package,
      link: "/admin/products",
      color: "bg-indigo-600",
    },
    {
      title: "Orders",
      description: "View customer orders and order status.",
      icon: ShoppingCart,
      link: "/admin/orders",
      color: "bg-emerald-600",
    },
    {
      title: "Users",
      description: "See all registered users and admin accounts.",
      icon: Users,
      link: "/admin/users",
      color: "bg-orange-500",
    },
    {
      title: "Support Messages",
      description: "Read support requests from customers.",
      icon: MessageSquare,
      link: "/admin/support",
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-indigo-400 font-medium mb-2">Admin Panel</p>
            <h1 className="text-4xl font-bold">
              Welcome back, {user?.name || "Admin"}
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your e-commerce store from one place.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-semibold transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="group bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 hover:-translate-y-1 transition duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition`}
                >
                  <Icon size={28} />
                </div>

                <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                <p className="text-slate-400 text-sm leading-6">
                  {card.description}
                </p>

                <div className="mt-6 text-indigo-400 font-medium">
                  Open →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <p className="text-slate-400 text-sm">Total Products</p>
            <h3 className="text-4xl font-bold mt-2">100+</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <p className="text-slate-400 text-sm">Pending Orders</p>
            <h3 className="text-4xl font-bold mt-2">12</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <p className="text-slate-400 text-sm">Support Requests</p>
            <h3 className="text-4xl font-bold mt-2">5</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

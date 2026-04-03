import { useEffect, useState } from "react";
import axios from "axios";
import { Shield, User, Trash2 } from "lucide-react";

const API = axios.create({
  baseURL: "http://localhost:2001/api",
});

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Delete this user account?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-indigo-400 font-medium mb-2">
            Admin / Users
          </p>
          <h1 className="text-4xl font-bold">Manage Users</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-slate-400">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-800/50 border-b border-slate-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      User
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-slate-400 font-medium">
                      Joined
                    </th>
                    <th className="text-right px-6 py-4 text-slate-400 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-slate-400 font-mono">
                              {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm">
                            <Shield size={14} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm">
                            <User size={14} />
                            Customer
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => deleteUser(user._id)}
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

import { useEffect, useState } from "react";
import { Mail, User, Trash2 } from "lucide-react";
import API from "../services/api";

export default function AdminSupport() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await API.get("/support", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Delete this support message?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/support/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(messages.filter((msg) => msg._id !== id));
    } catch {
      alert("Failed to delete message");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-indigo-400 font-medium mb-2">
            Admin / Support
          </p>
          <h1 className="text-4xl font-bold">Support Messages</h1>
        </div>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-slate-400">
            Loading support messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-slate-400">
            No support messages found.
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((message) => (
              <div
                key={message._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User size={18} />
                        {message.name}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail size={18} />
                        {message.email}
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-2">
                      {message.subject}
                    </h2>

                    <p className="text-slate-300 leading-7">
                      {message.message}
                    </p>

                    <p className="mt-4 text-sm text-slate-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="self-start w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

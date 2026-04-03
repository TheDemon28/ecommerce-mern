import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import API from "../services/api";

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/support", form);

      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error("Error submitting support request:", error);
      alert("Failed to submit: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-5 shadow-lg">
            <MessageSquare size={30} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Support & Contact Us
          </h1>

          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
            Need help with your order, account or products? Reach out to us and
            our support team will get back to you quickly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Phone</h3>
                  <p className="text-slate-500 mt-1">+91 98765 43210</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Mon - Sat, 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Email</h3>
                  <p className="text-slate-500 mt-1">
                    support@Techcart.com
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    We usually reply within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Office</h3>
                  <p className="text-slate-500 mt-1">
                    Pune, Maharashtra, India
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    NovaStore Support Center
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">Support Hours</h3>
                  <p className="text-slate-500 mt-1">
                    Monday - Saturday
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    9:00 AM - 8:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Send Us a Message
            </h2>

            {submitted && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-100 px-5 py-4 text-green-700 font-medium">
                Your message has been sent successfully. We'll contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-600">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="What do you need help with?"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-600">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none resize-none focus:border-indigo-500"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

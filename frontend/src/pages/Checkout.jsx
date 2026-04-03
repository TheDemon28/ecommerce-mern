import { useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Smartphone,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, totalPrice } = location.state || {};

  // State management
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Shipping form state
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  // Payment form state
  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  });

  // Calculate totals
  const subtotal =
    cart?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;
  const shipping_cost = subtotal > 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + shipping_cost + tax;

  // Validation
  const isShippingValid = () => {
    return (
      shipping.address.trim() &&
      shipping.city.trim() &&
      shipping.postalCode.trim() &&
      shipping.country.trim()
    );
  };

  const isPaymentValid = () => {
    if (paymentMethod === "cod") return true;
    if (paymentMethod === "card") {
      return (
        payment.cardNumber.length === 16 &&
        payment.cardName.trim() &&
        payment.cardExpiry.match(/^\d{2}\/\d{2}$/) &&
        payment.cardCvv.length === 3
      );
    }
    if (paymentMethod === "upi") {
      return payment.upiId.includes("@");
    }
    return false;
  };

  // Process payment (mock)
  const processPayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  };

  // Place order
  const handlePlaceOrder = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Process payment if not COD
      if (paymentMethod !== "cod") {
        const paymentSuccess = await processPayment();
        if (!paymentSuccess) {
          setError("Payment failed. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Create order
      const response = await API.post(
        "/orders",
        {
          shippingAddress: shipping,
          paymentMethod,
          orderItems: cart.map((item) => ({
            product: item.product._id || item.product,
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image,
          })),
          totalPrice: finalTotal,
          isPaid: paymentMethod !== "cod",
          paidAt: paymentMethod !== "cod" ? new Date() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrderId(response.data._id);
      setOrderPlaced(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/success", {
          state: { orderId: response.data._id, totalPrice: finalTotal },
        });
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      console.error("Order error:", err);
    } finally {
      setLoading(false);
    }
  };

  // No cart data
  if (!cart) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              No Cart Data
            </h2>
            <p className="text-slate-600 mb-6">
              Your cart appears to be empty. Please go back and add items.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order confirmation
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-emerald-200 bg-white p-12 text-center shadow-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4"
            >
              <CheckCircle size={48} />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-sm text-slate-500 mb-4">Order ID: {orderId}</p>
            <p className="text-slate-600 mb-6">
              Thank you for your purchase. You'll be redirected shortly.
            </p>
            <div className="text-3xl font-bold text-indigo-600 mb-6">
              ₹{finalTotal}
            </div>
            <Loader
              size={32}
              className="mx-auto animate-spin text-indigo-600"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-lg hover:bg-slate-200 transition"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>
            <p className="text-slate-500">Step {step} of 2</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping({ ...shipping, address: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Mumbai"
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping({ ...shipping, city: e.target.value })
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="400001"
                        value={shipping.postalCode}
                        onChange={(e) =>
                          setShipping({
                            ...shipping,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="India"
                      value={shipping.country}
                      onChange={(e) =>
                        setShipping({ ...shipping, country: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                    <Truck
                      size={20}
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold mb-1">Free Shipping</p>
                      <p>
                        Orders above ₹5000 qualify for free shipping. Current
                        subtotal: ₹{subtotal}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!isShippingValid()}
                  className="mt-6 w-full rounded-2xl bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <CreditCard size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* COD */}
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      className={`block p-4 rounded-2xl border-2 cursor-pointer transition ${
                        paymentMethod === "cod"
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mr-3"
                      />
                      <span className="font-semibold text-slate-900">
                        Cash on Delivery
                      </span>
                      <p className="text-sm text-slate-500 mt-1">
                        Pay when your order arrives
                      </p>
                    </motion.label>

                    {/* Credit/Debit Card */}
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      className={`block p-4 rounded-2xl border-2 cursor-pointer transition ${
                        paymentMethod === "card"
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mr-3"
                      />
                      <span className="font-semibold text-slate-900">
                        Credit/Debit Card
                      </span>
                      <p className="text-sm text-slate-500 mt-1">
                        Visa, Mastercard, American Express
                      </p>
                    </motion.label>

                    {/* UPI */}
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      className={`block p-4 rounded-2xl border-2 cursor-pointer transition ${
                        paymentMethod === "upi"
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="mr-3"
                      />
                      <span className="font-semibold text-slate-900">
                        UPI Payment
                      </span>
                      <p className="text-sm text-slate-500 mt-1">
                        Google Pay, PhonePe, Paytm
                      </p>
                    </motion.label>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Card Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={payment.cardName}
                          onChange={(e) =>
                            setPayment({ ...payment, cardName: e.target.value })
                          }
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4532 1234 5678 9010"
                          maxLength="16"
                          value={payment.cardNumber}
                          onChange={(e) =>
                            setPayment({
                              ...payment,
                              cardNumber: e.target.value.replace(/\s/g, ""),
                            })
                          }
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="12/25"
                            maxLength="5"
                            value={payment.cardExpiry}
                            onChange={(e) =>
                              setPayment({
                                ...payment,
                                cardExpiry: e.target.value,
                              })
                            }
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength="3"
                            value={payment.cardCvv}
                            onChange={(e) =>
                              setPayment({
                                ...payment,
                                cardCvv: e.target.value,
                              })
                            }
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI Payment Form */}
                {paymentMethod === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="text-indigo-600" size={20} />
                      <h3 className="text-xl font-bold text-slate-900">
                        UPI ID
                      </h3>
                    </div>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={payment.upiId}
                      onChange={(e) =>
                        setPayment({ ...payment, upiId: e.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className="text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 text-lg font-semibold text-slate-900 hover:bg-slate-100 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!isPaymentValid() || loading}
                    className="flex-1 rounded-2xl bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Order Summary */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sticky top-28">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              {cart.map((item) => (
                <div
                  key={item.product?._id || item.product}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </p>

                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>

                    <p className="text-sm font-bold text-indigo-600">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="space-y-3 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping_cost === 0 ? "Free" : `₹${shipping_cost}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Tax (18%)</span>
                <span className="font-semibold text-slate-900">₹{tax}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

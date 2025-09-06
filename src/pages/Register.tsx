import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { register } from "../api/api";
import { notify } from "../lib/alerts"; // ← SweetAlert2 toasts

import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function Register() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "novice",
    payment_method: "", // Stripe card id
    interval: "yearly",
  });

  // Check if user is Post Founding (>= Jan 1, 2026)
  const isPostFounding = new Date() >= new Date("2026-01-01T00:00:00");

  const [selectedRole, setSelectedRole] = useState("novice");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Utility: check if user is Founding Member (before Jan 1, 2026)
  const isFoundingMember = new Date() < new Date("2026-01-01");

  const roleOptions = isFoundingMember
    ? [
        {
          value: "novice",
          title: "Novice Membership",
          description: "$21.99/year (Founding Offer)",
          features: [
            "Access to personalized workout & meal plans",
            "Progress tracking dashboard",
            "Full exercise library",
            "Trainer support",
          ],
          priceLabel: "Special Founding Price $21.99/year",
          priceKey: "founding_novice_yearly",
          interval: "yearly",
          icon: <User className="h-6 w-6 text-red-500" />,
        },
        {
          value: "trainer",
          title: "Certified Trainer",
          description: "$34.99/year (Founding Offer)",
          features: [
            "Includes all Novice features",
            "Client management tools",
            "Program creation & delivery",
            "Platform to grow your coaching business",
          ],
          priceLabel: "Special Founding Price $34.99/year",
          priceKey: "founding_trainer_yearly",
          interval: "yearly",
          icon: <User className="h-6 w-6 text-red-500" />,
        },
      ]
    : [
        {
          value: "novice",
          title: "Novice Membership",
          description: "$4.99/month or $46.99/year",
          features: [
            "Access to personalized workout & meal plans",
            "Progress tracking dashboard",
            "Full exercise library",
            "Trainer support",
          ],
          monthly: {
            priceLabel: "$4.99/month",
            priceKey: "post_novice_monthly",
            interval: "monthly",
          },
          yearly: {
            priceLabel: "$46.99/year",
            priceKey: "post_novice_yearly",
            interval: "yearly",
          },
          icon: <User className="h-6 w-6 text-red-500" />,
        },
        {
          value: "trainer",
          title: "Certified Trainer",
          description: "$8.99/month or $89.99/year",
          features: [
            "Includes all Novice features",
            "Client management tools",
            "Program creation & delivery",
            "Platform to grow your coaching business",
          ],
          monthly: {
            priceLabel: "$8.99/month",
            priceKey: "post_trainer_monthly",
            interval: "monthly",
          },
          yearly: {
            priceLabel: "$89.99/year",
            priceKey: "post_trainer_yearly",
            interval: "yearly",
          },
          icon: <User className="h-6 w-6 text-red-500" />,
        },
      ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Basic client-side checks; all feedback via toasts
  const validateOrToast = (): boolean => {
    if (!formData.fullname.trim()) {
      notify.error("Full name is required.");
      return false;
    }
    if (!formData.email.trim()) {
      notify.error("Email is required.");
      return false;
    }
    if (!formData.password.trim()) {
      notify.error("Password is required.");
      return false;
    }
    if (formData.password.length < 6) {
      notify.error("Password must be at least 6 characters.");
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      notify.error("Passwords do not match.");
      return false;
    }
    return true;
    // Server-side will still validate and toast via interceptor on 422
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateOrToast()) return;

    setLoading(true);

    if (!stripe || !elements) {
      notify.error("Stripe has not loaded yet. Please try again.");
      setLoading(false);
      return;
    }

    // 1) Create payment method (client-side)
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    if (stripeError) {
      console.error(stripeError);
      notify.error(stripeError.message || "Payment method failed.");
      setLoading(false);
      return;
    }

    try {
      // 2) Register (server-side) — success toast via meta.successMessage
      await register(
        {
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: selectedRole as "novice" | "trainer",
          payment_method: paymentMethod.id,
          interval: formData.interval as "monthly" | "yearly",
        } as any,
        { meta: { successMessage: "Account created 🎉 Welcome to Ajurnie!" } }
      );

      // Optional: tiny success visual on page (icon flash) while we redirect
      // Or skip — the toast already shows success.
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      // Axios interceptor already showed an error toast (422/401/500...)
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/A-Journie-White-Logo.png"
              alt="Ajurnie"
              className="h-12 w-auto mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400">
              Try our gym classes free! Experience the energy, the trainers, and the
              results then choose your plan:{" "}
              <span className="text-red-400">Novice Membership $4.99/month</span> or{" "}
              <span className="text-red-400">Certified Trainer $8.99/month</span>
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Your Membership Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedRole === option.value
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-600 hover:border-gray-500 bg-gray-700/50"
                  }`}
                  onClick={() => {
                    setSelectedRole(option.value);
                    setFormData((prev) => ({
                      ...prev,
                      role: option.value,
                    }));
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={selectedRole === option.value}
                    readOnly
                    className="sr-only"
                  />
                  <div className="flex items-center mb-3">
                    {option.icon}
                    <h4 className="text-xl font-semibold text-white ml-3">
                      {option.title}
                    </h4>
                  </div>
                  <p className="text-gray-300 mb-4">{option.description}</p>
                  <ul className="space-y-2 mb-4">
                    {option.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-400 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm font-medium text-red-400">
                    {"priceLabel" in option ? (option as any).priceLabel : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Membership Interval */}
            {isPostFounding && (
              <div>
                <label htmlFor="interval" className="block text-sm font-medium text-gray-300 mb-2">
                  Membership Interval
                </label>
                <select
                  id="interval"
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  className="w-full pl-3 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Card Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Details
              </label>
              <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
                <CardElement options={{ style: { base: { color: "#fff", fontSize: "16px" } } }} />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Account..."
                  : `Register as ${selectedRole === "novice" ? "Novice Member" : "Certified Trainer"}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

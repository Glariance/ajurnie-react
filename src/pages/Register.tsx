import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { register } from "../api/api"; // <-- Import our API register function

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "novice",
  });

  const [selectedRole, setSelectedRole] = useState("novice");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roleOptions = [
    {
      value: "novice",
      title: "Novice Membership",
      description: "$21.99/year",
      features: ["Access to personalized workout & meal plans", "Progress tracking dashboard", "Full exercise library", "Trainer support"],
      price: "$9.99/month after trial",
      icon: <User className="h-6 w-6 text-red-500" />,
    },
    {
      value: "trainer",
      title: "Certified Trainer",
      description: "$34.99/year",
      features: ["Includes all Novice features", "Client management tools", "Program creation & delivery", "Platform to grow your coaching business"],
      price: "$19.99/month after trial",
      icon: <User className="h-6 w-6 text-red-500" />,
    },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await register({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: selectedRole as "novice" | "trainer",
      });

      setSuccess(true);

      setFormData({
        fullname: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "novice",
      });
      
      setSelectedRole("novice");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {/* Success Screen */}
          {
          success ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
              Thank you for registering!
              </h2>
              <p className="text-gray-300 mb-6">
              Your account has been created. We appreciate you joining Ajurnie.
              </p>
              <p className="text-gray-400">Redirecting to login...</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <img
                  src="/A-Journie-White-Logo.png"
                  alt="Ajurnie"
                  className="h-12 w-auto mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <p className="text-gray-400">
                  Try our gym classes free! Experience the energy, the trainers, and the results then choose your plan: <span className="text-red-400"> <br></br> Novice Membership for just $9.99/month</span> or <span className="text-red-400">Certified Trainer for only $19.99/month</span>
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
                      <p className="text-gray-300 mb-4">
                        {option.description}
                      </p>
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
                        {option.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
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
                      : `Start 7-Day Free Trial as ${
                          selectedRole === "novice"
                            ? "Novice Member"
                            : "Certified Trainer"
                        }`}
                  </button>
                </div>
              </form>
            </>
          )
          }
        </div>
      </div>
    </div>
  );
}

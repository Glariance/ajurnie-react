import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { login } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await login({ email, password });

      if (data?.message === "Invalid credentials" || !data?.token) {
        setError("Invalid email or password.");
      } else {
        setSuccess(true);
        setLoading(true);

        // Wait until auth_token is set in localStorage, then redirect
        const checkTokenAndRedirect = () => {
          const token = localStorage.getItem("auth_token");
          if (token) {
        navigate("/account/dashboard");
        window.location.reload();
          } else {
        // Retry after a short delay
        setTimeout(checkTokenAndRedirect, 300);
          }
        };

        checkTokenAndRedirect();
      }
        } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {success ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Login Successful!
              </h2>
              {/* <p className="text-gray-300 mb-6">Redirecting to dashboard...</p> */}
            </div>
          ) : (
            <div>
              {/* Logo & Welcome */}
              <div className="text-center mb-8">
                <img
                  src="/A-Journie-White-Logo.png"
                  alt="Ajurnie"
                  className="h-12 w-auto mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-400">Sign in to your account</p>
              </div>

              {/* Error Message */}
              {/* {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-red-300">{error}</span>
                </div>
              )} */}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              {/* Sign up link */}
                <div className="mt-4 text-center text-sm">
                  <p className="text-gray-400">
                    <Link
                      to="/forgot-password"
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Forgot your password?
                    </Link>
                    {" | "}
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

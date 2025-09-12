import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      // This will trigger global toasts via axios interceptors
      await requestPasswordReset(email);
      setEmail("");
    } catch (_) {
      // Errors are already handled by global notify toasts via interceptors
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || email.trim() === "";

  return (
    <div className="min-h-[70vh] bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-lg px-4 py-10 md:py-14">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back to Login
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-slate-800/60 ring-1 ring-white/10">
          <div className="border-b border-white/10 p-6">
            <h1 className="text-xl font-semibold tracking-tight">Forgot your password?</h1>
            <p className="mt-1 text-sm text-slate-300/90">
              Enter the email associated with your account and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-200">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-slate-900 px-10 py-3 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={disabled}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium shadow-lg shadow-rose-950/30 transition focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                disabled ? "bg-rose-600/60 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending link...
                </>
              ) : (
                <>Send reset link</>
              )}
            </button>
          </form>
        </div>

        <div className="mx-auto mt-6 flex max-w-lg items-center justify-center">
          <Link
            to="/"
            className="text-sm text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
          >
            Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

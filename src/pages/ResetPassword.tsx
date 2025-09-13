import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation, useParams } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: tokenParam } = useParams();
  const { completePasswordReset } = useAuth();
  const [params] = useSearchParams();

  // Prefer query params; fall back to /reset-password/:token
  const tokenFromQuery = params.get("token") || "";
  const emailFromQuery = params.get("email") || "";
  const tokenFromParam = tokenParam ?? "";

  const initialToken = tokenFromQuery || tokenFromParam;
  const [email, setEmail] = useState(emailFromQuery);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      token.trim().length > 0 &&
      password.length >= 8 &&
      password === confirm
    );
  }, [email, token, password, confirm]);

  const disabled = loading || !canSubmit;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      const { error } = await completePasswordReset({
        email,
        token,
        password,
        password_confirmation: confirm,
      });

      if (!error) {
        // success toast is shown by interceptor (api.resetPassword)
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

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
            <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
            <p className="mt-1 text-sm text-slate-300/90">
              Choose a strong password of at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-slate-200">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  readOnly={!!emailFromQuery}
                  className={`w-full rounded-xl bg-slate-900 px-10 py-3 outline-none ring-1 ring-white/10 ${
                    emailFromQuery
                      ? "cursor-not-allowed text-slate-400"
                      : "text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-rose-400"
                  }`}
                />
              </div>
            </div>

            {/* Token field (only if not in URL) */}
            {!tokenFromQuery && !tokenFromParam && (
              <div>
                <label className="mb-2 block text-sm text-slate-200">Reset token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token from email"
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-rose-400"
                />
              </div>
            )}

            {/* New password */}
            <div>
              <label className="mb-2 block text-sm text-slate-200">New password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-900 px-10 py-3 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-2 block text-sm text-slate-200">Confirm password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
                  <Loader2 className="size-4 animate-spin" /> Updating password...
                </>
              ) : (
                <>Update password</>
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

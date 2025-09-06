import React, { useCallback, useState, useId } from "react";
import { changePassword } from "../../api/api";
import useSession from "../../hooks/useSession";
import { notify } from "../../lib/alerts"; // ← SweetAlert2 helpers
import { Calendar, Target, TrendingUp, Award } from "lucide-react";

type PasswordFields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Simple field wrapper (no error rendering)
function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-gray-300 text-sm">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg bg-gray-900 border border-gray-700 outline-none px-3 py-2 text-gray-100 placeholder-gray-500 " +
        "focus:border-red-600 focus:ring-2 focus:ring-red-600/40 hover:border-red-600 " +
        (props.className || "")
      }
    />
  );
}

export default function ChangePassword() {
  const { user, loading } = useSession(); // token via interceptor
  const [form, setForm] = useState<PasswordFields>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const idCurrent = useId();
  const idNew = useId();
  const idConfirm = useId();

  // ---------- Helpers ----------
  const onChange = useCallback((key: keyof PasswordFields, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  }, []);

  // Client-side validation -> SweetAlert toast (no inline errors)
  const validateOrToast = (): boolean => {
    const msgs: string[] = [];
    if (!form.currentPassword.trim()) msgs.push("Current password is required.");
    if (!form.newPassword.trim()) msgs.push("New password is required.");
    if (form.newPassword && form.newPassword.length < 6)
      msgs.push("Password must be at least 6 characters.");
    if (form.confirmPassword !== form.newPassword)
      msgs.push("Passwords do not match.");

    if (msgs.length) {
      // show only the first to keep it concise
      notify.error(msgs[0]);
      return false;
    }
    return true;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    if (!validateOrToast()) return;

    setSaving(true);
    try {
      await changePassword(
        {
          current_password: form.currentPassword,
          new_password: form.newPassword,
          new_password_confirmation: form.confirmPassword, // Laravel 'confirmed'
        }
        // No need to pass meta here if your helper already sets successMessage + dontRedirectOn401
      );

      // success toast is shown by interceptor via meta.successMessage
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      // Server errors (including 422 validation from Laravel) are globally toasted by the interceptor.
      // We intentionally do not render field-level messages here.
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Only block UI while the session hook is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">
            Update your personal information and preferences
          </p>
        </div>

        {/* Stats Grid (kept for visual consistency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Progress</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Workouts</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/30 rounded-lg">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          <form className="grid grid-cols-1 gap-4 w-full" onSubmit={handleSubmit} noValidate>
            <Field id={idCurrent} label="Current Password">
              <Input
                id={idCurrent}
                type="password"
                name="current_password"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={(e) => onChange("currentPassword", e.target.value)}
                placeholder="Enter current password"
                required
              />
            </Field>

            <Field id={idNew} label="New Password">
              <Input
                id={idNew}
                type="password"
                name="new_password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={(e) => onChange("newPassword", e.target.value)}
                placeholder="Create new password"
                minLength={6}
                required
              />
            </Field>

            <Field id={idConfirm} label="Confirm Password">
              <Input
                id={idConfirm}
                type="password"
                name="new_password_confirmation"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </Field>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Password"}
            </button>

            {!user && (
              <p className="mt-3 text-xs text-yellow-400">
                You appear to be logged out. You can still type, but saving will require auth.
              </p>
            )}
          </form>

          <p className="mt-3 text-xs text-red-400 sz">
            Password must be at least 6 characters and both new password fields must match.
          </p>
        </div>
      </div>
    </div>
  );
}

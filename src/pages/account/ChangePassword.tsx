import React, { useState } from "react";
import api from "../../api/api";
import useSession from "../../hooks/useSession";
import { Calendar, Target, TrendingUp, Award } from "lucide-react";


type PasswordFields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const { user, loading, token } = useSession();
  const [form, setForm] = useState<PasswordFields>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  
  // ---------- Helpers ----------
  const onChange = (key: keyof PasswordFields, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.currentPassword.trim())
      e.currentPassword = "Current password is required";
    if (!form.newPassword.trim()) e.newPassword = "New password is required";
    if (form.newPassword.length < 6)
      e.newPassword = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.newPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const savePassword = async () => {
    if (!validate()) return;
    setSaving(true);
    setMessage("");

    try {
      await api.post(
        "/api/change-password",
        {
          current_password: form.currentPassword,
          new_password: form.newPassword,
          confirm_password: form.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Password updated successfully ✅");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error(err);
      setMessage("Could not update password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Reusable UI ----------
  const Field: React.FC<{
    label: string;
    error?: string;
    children: React.ReactNode;
  }> = ({ label, error, children }) => (
    <label className="grid gap-1.5">
      <span className="text-gray-300 text-sm">{label}</span>
      {children}
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </label>
  );

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={
        "w-full rounded-lg bg-gray-900 border border-gray-700 outline-none px-3 py-2 text-gray-100 placeholder-gray-500 " +
        "focus:border-red-600 focus:ring-2 focus:ring-red-600/40 hover:border-red-600 " +
        (props.className || "")
      }
    />
  );

    if (!user || !form) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
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
                <p className="text-sm font-medium text-gray-400">
                  Active Goals
                </p>
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

          <div className="grid grid-cols-1 gap-4 w-full">
            <Field label="Current Password" error={errors.currentPassword}>
              <Input
                type="password"
                value={form.currentPassword}
                onChange={(e) => onChange("currentPassword", e.target.value)}
                placeholder="Enter current password"
              />
            </Field>

            <Field label="New Password" error={errors.newPassword}>
              <Input
                type="password"
                value={form.newPassword}
                onChange={(e) => onChange("newPassword", e.target.value)}
                placeholder="Create new password"
              />
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                placeholder="Re-enter new password"
              />
            </Field>
          </div>

          {message && <p className="mt-4 text-sm text-green-400">{message}</p>}

          <button
            onClick={savePassword}
            disabled={saving}
            className="mt-6 w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

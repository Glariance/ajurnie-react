// src/routes/AccountProfile.tsx
import React, { useEffect, useRef, useState } from "react";
import { Calendar, Target, TrendingUp, Award } from "lucide-react";
import { getUser, updateUser, API_BASE_URL } from "../../api/api";
import useSession from "../../hooks/useSession";
import { notify } from "../../lib/alerts"; // ⬅️ use the same notify used in api instance

// ---------- Subcomponents (OUTSIDE so identity is stable) ----------
type FieldProps = { label: string; error?: string; children: React.ReactNode };
const Field = React.memo(function Field({ label, error, children }: FieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-gray-300 text-sm">{label}</span>
      {children}
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </label>
  );
});

type CardProps = { title?: string; children: React.ReactNode };
const Card = React.memo(function Card({ title, children }: CardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
});

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;
const TextInput = React.memo(function TextInput(props: TextInputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={
        "w-full rounded-lg bg-gray-700 border border-gray-700 outline-none px-3 py-2 text-gray-100 placeholder-gray-400 " +
        "focus:border-red-600 focus:ring-2 focus:ring-red-600/40 hover:border-red-600 " +
        (className ? " " + className : "")
      }
    />
  );
});

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement>;
const SelectInput = React.memo(function SelectInput(props: SelectInputProps) {
  const { className, ...rest } = props;
  return (
    <select
      {...rest}
      className={
        "w-full rounded-lg bg-gray-700 border border-gray-700 outline-none px-3 py-2 text-gray-100 placeholder-gray-400 " +
        "focus:border-red-600 focus:ring-2 focus:ring-red-600/40 hover:border-red-600 " +
        (className ? " " + className : "")
      }
    />
  );
});

// build a full URL from what backend sends
const normalizeAvatarUrl = (raw?: string): string => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw; // already absolute
  if (raw.startsWith("/storage/"))          // e.g. /storage/avatars/...
    return API_BASE_URL.replace(/\/+$/, "") + raw;
  // e.g. avatars/filename.png
  return API_BASE_URL.replace(/\/+$/, "") + "/storage/" + raw.replace(/^\/+/, "");
};

// ---------- Types ----------
type UserForm = {
  id?: number | string;
  fullname?: string;
  email?: string; // read-only
  phone?: string;
  dob?: string;
  gender?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  bio?: string;
  avatarUrl?: string; // normalized absolute URL for <img>
};

const fromApi = (d: any = {}): UserForm => ({
  id: d.id,
  fullname: d.fullname ?? "",
  email: d.email ?? "",
  phone: d.phone ?? "",
  dob: d.dob ?? "",
  gender: d.gender ?? "",
  address1: d.address1 ?? "",
  address2: d.address2 ?? "",
  city: d.city ?? "",
  state: d.state ?? "",
  zip: d.zip ?? "",
  country: d.country ?? "",
  bio: d.bio ?? "",
  // accept either avatarUrl (preferred) or raw avatar path and normalize
  avatarUrl: normalizeAvatarUrl(d.avatarUrl ?? d.avatar),
});




// ---------- Page ----------
export default function AccountProfile() {
  const { user } = useSession();

  const [form, setForm] = useState<UserForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const didInit = useRef(false);
  const hasEdited = useRef(false);
  const baselineRef = useRef<UserForm | null>(null);

  useEffect(() => {
    if (!user || didInit.current) return;
    didInit.current = true;

    const seeded = fromApi(user);
    setForm(seeded);
    setAvatarPreview(seeded.avatarUrl || "");
    baselineRef.current = seeded;

    getUser({ meta: { suppressErrorAlert: true } })
      .then((data) => {
        const fresh = fromApi(data || {});
        if (hasEdited.current) {
          setForm((prev) => {
            if (!prev) return fresh;
            return {
              ...prev,
              avatarUrl: avatarFile ? prev.avatarUrl : fresh.avatarUrl ?? prev.avatarUrl,
            };
          });
        } else {
          setForm(fresh);
          setAvatarPreview(fresh.avatarUrl || "");
          baselineRef.current = fresh;
        }
      })
      .catch(() => {});
  }, [user, avatarFile]);

  const onChange = (key: keyof UserForm, value: any) => {
    hasEdited.current = true;
    setForm((p) => ({ ...(p || {}), [key]: value }));
  };

  const handleAvatar = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify.error("Please select an image file"); // use same notifier
      return;
    }
    hasEdited.current = true;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  // ⬇️ Use notify.error when validation fails
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form?.fullname?.trim()) e.fullname = "Full name is required";
    if (form?.phone && !/^\+?[0-9\-()\s]{7,}$/.test(form.phone))
      e.phone = "Enter a valid phone";
    if (form?.zip && form.zip.length < 3) e.zip = "Invalid zip";
    setErrors(e);

    const keys = Object.keys(e);
    if (keys.length > 0) {
      // show the first error via Sweet notify
      notify.error(e[keys[0]]);
      return false;
    }
    return true;
  };

  const buildPayload = (next: UserForm, prev: UserForm | null) => {
    const out: Record<string, any> = {};
    ([
      "fullname","phone","dob","gender",
      "address1","address2","city","state","zip","country","bio",
    ] as const).forEach((k) => {
      const nv = next[k];
      const pv = prev?.[k];
      if (nv !== pv && nv !== undefined) out[k] = nv;
    });
    return out;
  };

  const saveUser = async () => {
    if (!form || !validate()) return; // notify.error already shown
    setSaving(true);
    setMessage("");

    try {
      const payload = buildPayload(form, baselineRef.current);
      if (avatarFile) payload.avatar = avatarFile;

      await updateUser(payload); // success toast comes from axios meta

      const fresh = fromApi(await getUser({ meta: { suppressErrorAlert: true } }));
      setForm(fresh);
      setAvatarPreview(fresh.avatarUrl || "");
      baselineRef.current = fresh;
      hasEdited.current = false;

      setMessage("Profile updated successfully");
      setAvatarFile(null);
    } catch (e) {
      // Axios interceptor already shows a sweet notify.error with server message
      setMessage("Could not save profile. Please try again.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

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
          <p className="text-gray-400">Update your personal information and preferences</p>
        </div>

        {/* Decorative stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-900/30 rounded-lg"><Target className="h-6 w-6 text-red-400" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/30 rounded-lg"><TrendingUp className="h-6 w-6 text-green-400" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Progress</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/30 rounded-lg"><Calendar className="h-6 w-6 text-blue-400" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Workouts</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/30 rounded-lg"><Award className="h-6 w-6 text-yellow-400" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="grid grid-cols-1 gap-8">
          <div className="lg:col-span-2">
            <Card title="My Profile">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <img
                    src={avatarPreview || form.avatarUrl || "https://placehold.co/96x96"}
                    alt="avatar"
                    className="h-24 w-24 rounded-xl object-cover border border-gray-700"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 w-full">
                  <Field label="Full Name" error={errors.fullname}>
                    <TextInput value={form.fullname || ""} onChange={(e) => onChange("fullname", e.target.value)} />
                  </Field>

                  {/* Email is read-only and never sent to backend */}
                  <Field label="Email">
                    <TextInput type="email" value={form.email || ""} disabled readOnly />
                    <span className="text-xs text-gray-500">Email is read-only.</span>
                  </Field>

                  <Field label="Phone" error={errors.phone}>
                    <TextInput
                      value={form.phone || ""}
                      inputMode="tel"
                      pattern="[\d()+\-\s]*"
                      onChange={(e) => onChange("phone", e.target.value)}
                      placeholder="+1 555 000 1111"
                    />
                  </Field>

                  <Field label="Date of Birth">
                    <TextInput type="date" value={form.dob || ""} onChange={(e) => onChange("dob", e.target.value)} />
                  </Field>

                  <Field label="Gender">
                    <SelectInput value={form.gender || ""} onChange={(e) => onChange("gender", e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not">Prefer not to say</option>
                    </SelectInput>
                  </Field>

                  <div className="grid gap-2">
                    <span className="text-gray-300 text-sm">Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatar(e.target.files?.[0] || null)}
                      className="text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-700 file:px-3 file:py-2 file:text-gray-100 hover:file:bg-gray-600"
                    />
                    <span className="text-xs text-gray-500">PNG, JPG, WEBP up to ~2MB</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Field label="Address Line 1">
                  <TextInput value={form.address1 || ""} onChange={(e) => onChange("address1", e.target.value)} />
                </Field>
                <Field label="Address Line 2">
                  <TextInput value={form.address2 || ""} onChange={(e) => onChange("address2", e.target.value)} />
                </Field>
                <Field label="City">
                  <TextInput value={form.city || ""} onChange={(e) => onChange("city", e.target.value)} />
                </Field>
                <Field label="State / Province">
                  <TextInput value={form.state || ""} onChange={(e) => onChange("state", e.target.value)} />
                </Field>
                <Field label="ZIP" error={errors.zip}>
                  <TextInput value={form.zip || ""} onChange={(e) => onChange("zip", e.target.value)} />
                </Field>
                <Field label="Country">
                  <TextInput value={form.country || ""} onChange={(e) => onChange("country", e.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 mt-6">
                <Field label="Short Bio">
                  <textarea
                    rows={3}
                    value={form.bio || ""}
                    onChange={(e) => onChange("bio", e.target.value)}
                    placeholder="Tell us a little about you..."
                    className="w-full rounded-lg bg-gray-700 border border-gray-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/40 outline-none px-3 py-2 text-gray-100 placeholder-gray-400 hover:border-red-600"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">{message}</div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveUser}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

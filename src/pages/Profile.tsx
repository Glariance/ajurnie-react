import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api"; // ✅ centralized API instance
import useSession from "../hooks/useSession";
import { Calendar, Target, TrendingUp, Award } from "lucide-react";
import AccountLayout from "../layouts/AccountLayout";

// Mock data for right-side content (kept for parity with your dashboard)
const mockData = {
  events: [
    { id: 1, title: "Fitness Workshop", date: "2024-12-15", attendees: 25 },
    { id: 2, title: "Nutrition Seminar", date: "2024-12-20", attendees: 18 },
  ],
};

// ---------- Types (works fine in Vite even if JS; remove if using plain .jsx) ----------
export type UserProfile = {
  id?: string;
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  bio?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  timezone?: string;
  units?: "metric" | "imperial" | string;
  newsletter?: boolean;
  workoutReminders?: boolean;
  marketingEmails?: boolean;
  emergencyName?: string;
  emergencyPhone?: string;
  avatarUrl?: string;
};

export default function Profile() {
  const { user, loading, token } = useSession();

  // Form state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");


  // ---------- Fetch profile on mount ----------
  useEffect(() => {
    if (!user) return;
    api
      .get("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data: UserProfile = res.data || {};
        setProfile(data);
        setAvatarPreview(data?.avatarUrl || "");
      })
      .catch(() => setProfile({ fullname: user.fullname, email: user.email }))
      .finally(() => loading(false));
  }, [user]);

  const dirty = useMemo(() => JSON.stringify(profile), [profile]); // cheap trigger for Save enabled

  // ---------- Helpers ----------
  const onChange = (key: keyof UserProfile, value: any) => {
    setProfile((p) => ({ ...(p || {}), [key]: value }));
  };

  const handleAvatar = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file");
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!profile?.fullname?.trim()) e.fullname = "Full name is required";
    if (profile?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = "Enter a valid email";
    if (profile?.phone && !/^\+?[0-9\-()\s]{7,}$/.test(profile.phone)) e.phone = "Enter a valid phone";
    if (profile?.postalCode && profile.postalCode.length < 3) e.postalCode = "Invalid postal code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- Save profile ----------
  const saveProfile = async () => {
    if (!validate()) return;
    setSaving(true);
    setMessage("");

    try {
      // 1) If avatar selected, upload (adjust endpoint as needed)
      let avatarUrl = profile?.avatarUrl || "";
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const up = await api.post("/api/profile/avatar", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        avatarUrl = up?.data?.url || avatarUrl;
      }

      // 2) Save profile fields
      const payload = { ...(profile || {}), avatarUrl };
      await api.put("/api/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Profile updated successfully");
      setAvatarFile(null);
      setProfile((p) => ({ ...(p || {}), avatarUrl }));
    } catch (err) {
      console.error(err);
      setMessage("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ---------- Reusable UI bits ----------
  const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );

  const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
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
        (props.className ? props.className : "")
      }
    />
  );

  const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
      {...props}
      className={
        "w-full rounded-lg bg-gray-900 border border-gray-700 outline-none px-3 py-2 text-gray-100 " +
        "focus:border-red-600 focus:ring-2 focus:ring-red-600/40 hover:border-red-600 " +
        (props.className ? props.className : "")
      }
    />
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">Update your personal information and preferences</p>
        </div>

        {/* Stats Grid (kept for visual consistency) */}
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🔹 Profile Form */}
          <div className="lg:col-span-2">
            <Card title="My Profile">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <img
                    src={avatarPreview || profile.avatarUrl || "https://placehold.co/96x96"}
                    alt="avatar"
                    className="h-24 w-24 rounded-xl object-cover border border-gray-700"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 w-full">
                  <Field label="Full Name" error={errors.fullname}>
                    <Input
                      value={profile.fullname || ""}
                      onChange={(e) => onChange("fullname", e.target.value)}
                      placeholder="John Doe"
                    />
                  </Field>
                  <Field label="Username">
                    <Input
                      value={profile.username || ""}
                      onChange={(e) => onChange("username", e.target.value)}
                      placeholder="johndoe"
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <Input
                      type="email"
                      value={profile.email || ""}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder="john@company.com"
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <Input
                      value={profile.phone || ""}
                      onChange={(e) => onChange("phone", e.target.value)}
                      placeholder="+1 555 000 1111"
                    />
                  </Field>
                  <Field label="Date of Birth">
                    <Input type="date" value={profile.dob || ""} onChange={(e) => onChange("dob", e.target.value)} />
                  </Field>
                  <Field label="Gender">
                    <Select value={profile.gender || ""} onChange={(e) => onChange("gender", e.target.value)}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not">Prefer not to say</option>
                    </Select>
                  </Field>

                  <div className="grid gap-2">
                    <span className="text-gray-300 text-sm">Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatar(e.target.files?.[0] || null)}
                      className="text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-700 file:px-3 file:py-2 file:text-gray-100 hover:file:bg-gray-600"
                    />
                    <span className="text-xs text-gray-500">PNG, JPG up to ~2MB</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Field label="Address Line 1">
                  <Input value={profile.address1 || ""} onChange={(e) => onChange("address1", e.target.value)} />
                </Field>
                <Field label="Address Line 2">
                  <Input value={profile.address2 || ""} onChange={(e) => onChange("address2", e.target.value)} />
                </Field>
                <Field label="City">
                  <Input value={profile.city || ""} onChange={(e) => onChange("city", e.target.value)} />
                </Field>
                <Field label="State / Province">
                  <Input value={profile.state || ""} onChange={(e) => onChange("state", e.target.value)} />
                </Field>
                <Field label="Postal Code" error={errors.postalCode}>
                  <Input value={profile.postalCode || ""} onChange={(e) => onChange("postalCode", e.target.value)} />
                </Field>
                <Field label="Country">
                  <Input value={profile.country || ""} onChange={(e) => onChange("country", e.target.value)} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <Field label="Units">
                  <Select value={profile.units || "metric"} onChange={(e) => onChange("units", e.target.value)}>
                    <option value="metric">Metric (kg, cm)</option>
                    <option value="imperial">Imperial (lb, in)</option>
                  </Select>
                </Field>
                <Field label="Timezone">
                  <Input value={profile.timezone || ""} onChange={(e) => onChange("timezone", e.target.value)} placeholder="e.g. Europe/London" />
                </Field>
                <div className="grid gap-1.5">
                  <span className="text-gray-300 text-sm">Newsletter</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onChange("newsletter", !profile.newsletter)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.newsletter ? "bg-red-600" : "bg-gray-600"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${profile.newsletter ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                    <span className="text-gray-400 text-sm">Get product news & tips</span>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <span className="text-gray-300 text-sm">Workout Reminders</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onChange("workoutReminders", !profile.workoutReminders)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.workoutReminders ? "bg-red-600" : "bg-gray-600"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${profile.workoutReminders ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                    <span className="text-gray-400 text-sm">Push/email reminders</span>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <span className="text-gray-300 text-sm">Marketing Emails</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onChange("marketingEmails", !profile.marketingEmails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.marketingEmails ? "bg-red-600" : "bg-gray-600"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${profile.marketingEmails ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                    <span className="text-gray-400 text-sm">Occasional promos</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 mt-6">
                <Field label="Short Bio">
                  <textarea
                    rows={3}
                    value={profile.bio || ""}
                    onChange={(e) => onChange("bio", e.target.value)}
                    placeholder="Tell us a little about you..."
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/40 outline-none px-3 py-2 text-gray-100 placeholder-gray-500 hover:border-red-600"
                  />
                </Field>
              </div>

              {/* Save Row */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">{message}</div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveProfile}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* 🔹 Right Side (Quick Actions + Events) */}

{/* <AccountLayout
      events={events}
      onStartWorkout={() => console.log("Start workout")}
      onViewProgress={() => console.log("View progress")}
      onUpdateGoals={() => console.log("Update goals")}
    > */}
      {/* ⬇️ Your existing Profile form/content goes here (left 2/3 column) */}
      {/* <Card title="My Profile"> ... </Card> */}
    {/* </AccountLayout> */}

          <div className="space-y-6">
            <Card title="Quick Actions">
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Start Workout</button>
                <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">View Progress</button>
                <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">Update Goals</button>
              </div>
            </Card>

            <Card title="Upcoming Events">
              <div className="space-y-3">
                {mockData.events.slice(0, 2).map((event) => (
                  <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}

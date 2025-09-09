import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { notify } from "../lib/alerts";


export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
// ------- Interceptors -------

// Add Bearer token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Extract a human-friendly error message (Laravel-friendly)
function extractErrorMessage(error: any): string {
  const data = error?.response?.data;
  if (!data) return "Something went wrong.";
  if (typeof data === "string") return data;

  // { message, errors: { field: [msg] } }
  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return String(first[0]);
  }
  if (data.message) return String(data.message);
  return "Request failed.";
}

// Handle responses (success + error)
api.interceptors.response.use(
  (response) => {
    // Show success toast only when explicitly requested
    const msg = response.config?.meta?.successMessage;
    if (msg) notify.success(msg);
    return response;
  },

  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url || "";
    const skip401 =
      error?.config?.meta?.dontRedirectOn401 ||
      /\/api\/change-password$/.test(url); // safety: don't redirect for this route

    // Auth handling
    if (status === 401 && !skip401) {
      localStorage.removeItem("auth_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Global error toast (unless suppressed)
    const suppress = error?.config?.meta?.suppressErrorAlert;
    if (!suppress) {
      const custom = error?.config?.meta?.errorMessage;
      const fallback = extractErrorMessage(error);
      notify.error(custom || fallback);
    }

    return Promise.reject(error);
  }
);

// ------- Helpers -------

// Get CSRF cookie (required for Sanctum stateful routes)
async function getCsrfCookie() {
  await api.get("/sanctum/csrf-cookie");
}

// ------- Auth API -------

export async function register(
  userData: {
    fullname: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: "novice" | "trainer";
    payment_method: string;
    interval: "monthly" | "yearly";
  },
  config: AxiosRequestConfig = {}
): Promise<any> {
  await getCsrfCookie();
  const response = await api.post("/api/register", userData, config);
  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
  }
  return response.data;
}

export async function login(
  credentials: { email: string; password: string },
  config: AxiosRequestConfig = {}
): Promise<any> {
  await getCsrfCookie();
  const response = await api.post("/api/login", credentials, config);
  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
  }
  return response.data;
}

export async function logout(config: AxiosRequestConfig = {}): Promise<void> {
  try {
    await api.post("/api/logout", undefined, config);
  } finally {
    localStorage.removeItem("auth_token");
  }
}

// ------- User APIs -------

export async function getUser(config: AxiosRequestConfig = {}): Promise<any> {
  const response = await api.get("/api/user", config);
  return response.data;
}

/**
 * Change Password
 * Expects: current_password, new_password, new_password_confirmation
 */
export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export async function changePassword(
  payload: ChangePasswordPayload,
  config: AxiosRequestConfig = {}
): Promise<any> {
  // If your route is completely stateless you can remove CSRF call
  await getCsrfCookie();
  const response = await api.post("/api/change-password", payload, {
    ...config,
    // convenience defaults for this endpoint
    meta: {
      dontRedirectOn401: true, // avoid auth redirect for business 401s (extra safety)
      successMessage: "Password updated successfully",
      ...(config.meta || {}),
    },
  });
  return response.data;
}

/**
 * Update User (partial update)
 * - Uses POST /api/update-user (your route).
 * - Sends JSON by default.
 * - If any value is a File/Blob, automatically switches to multipart/form-data.
 * - Email is READ-ONLY and will not be sent even if passed accidentally.
 */
export type UpdateUserPayload = {
  fullname?: string;
  // email?: string; // intentionally NOT supported for updates
  phone?: string;
  bio?: string;
  gender?: string;
  dob?: string; // 'YYYY-MM-DD'
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  avatar?: File | string | null;
  [key: string]: any;
};

export async function updateUser(
  updates: UpdateUserPayload,
  config: AxiosRequestConfig = {}
): Promise<any> {
  await getCsrfCookie();

  // Hard guard: never allow email to be sent
  if (Object.prototype.hasOwnProperty.call(updates, "email")) {
    delete (updates as any).email;
  }

  const hasFile =
    updates &&
    Object.values(updates).some(
      (v) => v instanceof File || (typeof Blob !== "undefined" && v instanceof Blob)
    );

  let data: any = updates;
  let headers: Record<string, string> | undefined;

  if (hasFile) {
    const fd = new FormData();
    Object.entries(updates).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v as any);
    });
    data = fd;
    headers = { "Content-Type": "multipart/form-data" };
  }

  // ✅ Use POST (your backend supports POST for this route)
  const response = await api.post("/api/update-user", data, {
    ...config,
    headers: { ...(headers || {}), ...(config.headers || {}) },
    meta: {
      successMessage: "Profile updated ✅",
      ...(config.meta || {}),
    },
  });
  return response.data;
}

// ------- Goals -------

export async function storeGoal(
  goalData: any,
  config: AxiosRequestConfig = {}
): Promise<any> {
  await getCsrfCookie();
  const response = await api.post("/api/store-goal", goalData, config);
  return response.data;
}

export default api;

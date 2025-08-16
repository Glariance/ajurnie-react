import axios, { type AxiosInstance } from "axios";

// Get API URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // required for Sanctum cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Helper: Get CSRF cookie
async function getCsrfCookie() {
  await api.get("/sanctum/csrf-cookie");
}

// Auth API functions
export async function register(userData: {
  fullname: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "novice" | "trainer";
}): Promise<any> {

  await getCsrfCookie(); // Step 1: fetch CSRF cookie
  const response = await api.post("/api/register", userData); // Step 2: register
  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
  }
  return response.data;
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<any> {

  await getCsrfCookie(); // Step 1: fetch CSRF cookie
  
  const response = await api.post("/api/login", credentials); // Step 2: login
  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
  }

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/logout");
  } finally {
    localStorage.removeItem("auth_token");
  }
}

export async function getUser(): Promise<any> {
  const response = await api.get("/api/user");
  return response.data;
}

// Goal API functions
export async function storeGoal(goalData: any): Promise<any> {

  // Step 1: Fetch CSRF cookie
  await getCsrfCookie();
  // Step 2: Submit goal data to Laravel
  const response = await api.post("/api/store-goal", goalData);
  return response.data;
}

export default api;

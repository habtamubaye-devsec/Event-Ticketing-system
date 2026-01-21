import axios from "axios";
import Cookies from "js-cookie";

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

// Set this to your backend origin, e.g. "https://my-api.vercel.app".
// If empty, requests will go to "/api" and can be handled by the Vite dev proxy.
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";

// Your server routes are mounted at /api (not /api/v1)
const API_URL = API_BASE_URL ? `${normalizeBaseUrl(API_BASE_URL)}/api` : "/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

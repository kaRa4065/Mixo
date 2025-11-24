// src/lib/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import API_CONFIG from "./config/config";

export interface ApiError {
  status: number;
  message: string;
}

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------------------------------------------
// REQUEST INTERCEPTOR → Add token
// --------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --------------------------------------------------------
// RESPONSE INTERCEPTOR → Normalize errors
// --------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    if (!error.response) {
      const networkError: ApiError = {
        status: 0,
        message: "Network error. Please check your connection.",
      };
      return Promise.reject(networkError);
    }

    const { status, data } = error.response as {
      status: number;
      data: any;
    };

    const originalRequest = error.config as AxiosRequestConfig;

    // ----------------- 400 ---------------------
    if (status === 400) {
      const err: ApiError = {
        status,
        message: data?.message ?? "Invalid request parameters",
      };
      return Promise.reject(err);
    }

    // ----------------- 429 - Retry ---------------------
    if (status === 429) {
      const retryAfter = data?.retry_after ?? 5;

      return new Promise((resolve) => {
        setTimeout(async () => {
          const res = await axiosInstance(originalRequest);
          resolve(res);
        }, retryAfter * 1000);
      });
    }

    // ----------------- 500+ server errors ---------------------
    if ([500, 502, 503, 504].includes(status)) {
      const err: ApiError = {
        status,
        message: data?.message ?? "Server error. Please try again later.",
      };
      return Promise.reject(err);
    }

    // Default fallback
    const genericError: ApiError = {
      status,
      message: data?.message || "Something went wrong",
    };

    return Promise.reject(genericError);
  }
);

export default axiosInstance;

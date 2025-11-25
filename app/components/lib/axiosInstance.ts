// src/lib/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import API_CONFIG from "./config/config";

export interface ApiError {
  status: number;
  message: string;
}

const MAX_RETRIES = 2;

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------------------------------------------
// RESPONSE → Retry up to 3 times
// --------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response.data,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retryCount?: number;
    };

    const status = error.response?.status ?? 0;
    const data = (error.response?.data ?? {}) as {
      message?: string;
      [key: string]: any;
    };
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // ---------- RETRY LOGIC ----------
    if (originalRequest && (originalRequest._retryCount ?? 0) < MAX_RETRIES) {
      originalRequest._retryCount! += 1;

      // retry request
      await wait(2000);

      return axiosInstance(originalRequest);
    }

    // ---------- After 3 failures → throw error ----------
    const finalError: ApiError = {
      status,
      message: data.message ?? "Something went wrong",
    };

    return Promise.reject(finalError);
  }
);

export default axiosInstance;

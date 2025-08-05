import axios, { AxiosRequestConfig } from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const API_BASE_URL = "https://dewataksu-backend.vercel.app/api";
const REFRESH_TOKEN_URL = "https://dewataksu-backend.vercel.app/api/token";
// const API_BASE_URL = "http://localhost:5050/api";
// const REFRESH_TOKEN_URL = "https://localhost:5050/api/token";

interface FailedQueuePromise {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

const getAccessToken = () => getCookie("accessToken");

const setAccessToken = (accessToken: string) => {
  setCookie("accessToken", accessToken, { path: "/" });
};

const clearClientTokens = () => {
  deleteCookie("accessToken", { path: "/" });
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: FailedQueuePromise[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = "Bearer " + token;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.get(REFRESH_TOKEN_URL);
        const { accessToken: newAccessToken } = response.data.data;
        setAccessToken(newAccessToken);
        if (axiosInstance.defaults.headers.common) {
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        }
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearClientTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export { axiosInstance, axiosPublic };

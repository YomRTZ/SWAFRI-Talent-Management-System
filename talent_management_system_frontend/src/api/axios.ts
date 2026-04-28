import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import {
  getUserSafeErrorTitle,
  getServerErrorDetails,
  getDirectErrorMessage,
} from "../errors/services/error.service";
import { AUTH_ENDPOINTS } from "./endpoints";

/* =========================================================
   CONFIG
========================================================= */

const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableMethods: ["GET", "HEAD", "OPTIONS", "DELETE", "PUT", "PATCH"],
};

/* =========================================================
   TYPES
========================================================= */

export interface RetryConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
  _retry?: boolean;
}

export interface ApiError {
  message?: string;
  title?: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/* =========================================================
   AXIOS INSTANCE
========================================================= */

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function clearAccessToken() {
  setAccessToken(null);
}

export function getAccessToken() {
  return accessToken;
}

export async function refreshAccessToken() {
  const response = await refreshClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
  const token = response.data?.data?.accessToken;
  if (typeof token === "string") {
    setAccessToken(token);
    return token;
  }
  throw new Error("Refresh token failed to return an access token");
}

/* =========================================================
   AXIOS ERROR TYPES
========================================================= */

interface EnrichedAxiosError extends AxiosError<ApiError> {
  safeMessage?: string;
  serverDetails?: string;
  rawServerMessage?: string;
}

/* =========================================================
   HELPERS
========================================================= */

const shouldRetry = (
  config: RetryConfig,
  error: AxiosError
): boolean => {
  if ((config._retryCount ?? 0) >= RETRY_CONFIG.maxRetries) return false;
  if (config._retry) return false;

  const method = config.method?.toUpperCase();
  if (!method || !RETRY_CONFIG.retryableMethods.includes(method)) return false;

  const status = error.response?.status;
  if (status && RETRY_CONFIG.retryableStatuses.includes(status)) return true;

  if (!error.response && error.code) {
    return [
      "ECONNABORTED",
      "ERR_NETWORK",
      "ERR_CONNECTION_REFUSED",
    ].includes(error.code);
  }

  return false;
};

const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

const getRetryDelay = (count: number) =>
  RETRY_CONFIG.retryDelay * Math.pow(2, count);

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers["X-Request-ID"] = crypto.randomUUID();

    // Fix FormData headers
    if (config.data instanceof FormData) {
      delete (config.headers as Record<string, unknown>)["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as RetryConfig;

    /* -------------------------
       REFRESH ON 401
    -------------------------- */
    if (
      config &&
      error.response?.status === 401 &&
      !config._retry &&
      config.url !== AUTH_ENDPOINTS.REFRESH_TOKEN &&
      config.url !== AUTH_ENDPOINTS.LOGIN &&
      config.url !== AUTH_ENDPOINTS.LOGOUT
    ) {
      config._retry = true;
      try {
        await refreshAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(config);
      } catch (refreshError) {
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      }
    }

    /* -------------------------
       RETRY LOGIC
    -------------------------- */
    if (config && shouldRetry(config, error)) {
      config._retryCount = (config._retryCount ?? 0) + 1;

      const wait =
        getRetryDelay(config._retryCount) + Math.random() * 500;

      await delay(wait);

      return api(config);
    }

    if (error.response?.status === 401 && config?._retry) {
      window.dispatchEvent(new Event("auth:logout"));
    }

     /* -------------------------
       ATTACH ENRICHED ERROR
     -------------------------- */
    enrichError(error);

    return Promise.reject(error);
  }
);

/* =========================================================
   ERROR ENRICHMENT
========================================================= */

function enrichError(error: EnrichedAxiosError) {
  const safeMessage = getUserSafeErrorTitle(error);
  const serverDetails = getServerErrorDetails(error);
  const rawMessage = getDirectErrorMessage(error);

  error.safeMessage = safeMessage;
  error.serverDetails = serverDetails;
  error.rawServerMessage = rawMessage;
}

/* =========================================================
   401 HANDLER
========================================================= */


/* =========================================================
   UTILITIES
========================================================= */

export const createApiInstance = (
  baseURL: string,
  custom?: object
) =>
  axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000,
    ...custom,
  });

export const isRetryableError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const config = { _retryCount: 0 } as RetryConfig;
    return shouldRetry(config, error);
  }
  return false;
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "safeMessage" in error) {
    return (error as EnrichedAxiosError).safeMessage ?? "";
  }

  if (axios.isAxiosError(error)) {
    return getUserSafeErrorTitle(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export default api;
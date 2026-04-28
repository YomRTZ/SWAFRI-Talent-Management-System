import axios, { AxiosError } from "axios";
import type { ErrorCategory, AppErrorResult } from "../type/error.types";

//CATEGORY DETECTION

function getCategory(error: unknown): ErrorCategory {
  if (!axios.isAxiosError(error)) return "unknown";

  const err = error as AxiosError<unknown>;
  const status = err.response?.status;

  if (!err.response) return "network";
  if (err.code === "ECONNABORTED") return "timeout";

  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status && status >= 500) return "server";

  return "unknown";
}

/* -------------------------
   EXTRACT BACKEND MESSAGE
-------------------------- */
type ErrorPayload = {
  message?: string;
  details?: string;
  error?: {
    message?: string;
    details?: string;
  } | string;
};

function getMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;

  const data = error.response?.data as ErrorPayload | undefined;

  return (
    data?.message ||
    (typeof data?.error === "object" ? data?.error?.message : undefined) ||
    (typeof data?.error === "string" ? data?.error : undefined) ||
    error.message
  );
}

/* -------------------------
   HELPER EXPORTS
-------------------------- */
export function getUserSafeErrorTitle(error: unknown): string {
  return getError(error).title;
}

export function getServerErrorDetails(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data as ErrorPayload | undefined;
  return (
    (typeof data?.error === "object" ? data?.error?.details : undefined) ||
    data?.details ||
    data?.message ||
    (typeof data?.error === "string" ? data?.error : undefined) ||
    undefined
  );
}

export function getDirectErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : String(error);
  }
  const data = error.response?.data as ErrorPayload | undefined;
  return (
    data?.message ||
    (typeof data?.error === "object" ? data?.error?.message : undefined) ||
    (typeof data?.error === "string" ? data?.error : undefined) ||
    error.message ||
    String(error)
  );
}

/* -------------------------
   SAFE UI MESSAGES
-------------------------- */
const MESSAGES: Record<
  ErrorCategory,
  { title: string; description?: string }
> = {
  network: {
    title: "No internet connection",
    description: "Check your network and try again.",
  },
  timeout: {
    title: "Request timed out",
    description: "Server is taking too long to respond.",
  },
  server: {
    title: "Server error",
    description: "Something went wrong. Please try again later.",
  },
  validation: {
    title: "Invalid input",
    description: "Please check your form fields.",
  },
  auth: {
    title: "Session expired",
    description: "Please log in again.",
  },
  forbidden: {
    title: "Access denied",
    description: "You don't have permission.",
  },
  not_found: {
    title: "Not found",
    description: "The requested resource doesn't exist.",
  },
  conflict: {
    title: "Already exists",
    description: "This item already exists.",
  },
  unknown: {
    title: "Something went wrong",
  },
};

/* -------------------------
   MAIN ERROR FUNCTION
-------------------------- */
export function getError(error: unknown): AppErrorResult {
  const category = getCategory(error);
  const backendMessage = getMessage(error);

  const base = MESSAGES[category];

  const title =
    category !== "server" && backendMessage
      ? backendMessage
      : base.title;

  return {
    title,
    description: base.description,
    category,
    isRetryable: ["network", "timeout", "conflict"].includes(category),
  };
}
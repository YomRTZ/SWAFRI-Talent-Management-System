export type ErrorCategory =
  | "network"
  | "timeout"
  | "server"
  | "validation"
  | "auth"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "unknown";

export interface AppErrorResult {
  title: string;
  description?: string;
  category: ErrorCategory;
  isRetryable: boolean;
}
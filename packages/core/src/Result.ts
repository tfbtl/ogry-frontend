import type { AppError } from "./AppError";

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };



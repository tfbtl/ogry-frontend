import type { AppError, Result } from "../types/foundation";
import { emitAuthEvent } from "../../auth/authEvents";

/**
 * Create a success Result
 */
export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

/**
 * Create an error Result
 */
export function err(error: AppError): Result<never> {
  return { ok: false, error };
}

/**
 * Create an AppError from a message
 */
export function createAppError(
  code: string,
  messageKey: string,
  details?: string,
  httpStatus?: number
): AppError {
  return {
    code,
    messageKey,
    details,
    httpStatus,
    clientTimestamp: new Date().toISOString(),
  };
}

/**
 * Create an AppError from an Error object
 */
export function errorFromException(
  error: Error,
  code: string = "INTERNAL_ERROR",
  httpStatus?: number
): AppError {
  return createAppError(code, error.message, error.message, httpStatus);
}

/**
 * Check if error is 401 Unauthorized
 * 
 * This helper is used in Adapter/UseCase layers only.
 * UI should NEVER import this function.
 */
export function isUnauthorized(error: AppError): boolean {
  return error.httpStatus === 401;
}

/**
 * Handle authentication errors centrally
 * 
 * If error is 401 Unauthorized, triggers SessionExpired event.
 * Returns the same error (no shape change, only side-effect).
 * 
 * This helper is used in Adapter/UseCase layers only.
 * UI should NEVER import this function.
 * 
 * @param error - AppError to check and handle
 * @returns Same AppError (for chaining)
 */
export function handleAuthError(error: AppError): AppError {
  if (isUnauthorized(error)) {
    emitAuthEvent({ type: "SessionExpired" });
  }
  // Return same error (no shape change)
  return error;
}


import type { AppError, Result } from "../shared/types/foundation";
import { emitAuthEvent } from "../auth/authEvents";
import { newCorrelationId } from "./correlation";
import { isProblemDetails, toAppError } from "./problemDetails";

const buildHeaders = (init?: RequestInit, hasBody?: boolean): Headers => {
  const headers = new Headers(init?.headers);

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("X-Correlation-Id", newCorrelationId());

  return headers;
};

const toNetworkError = (): AppError => ({
  code: "NETWORK_ERROR",
  messageKey: "errors.network",
  clientTimestamp: new Date().toISOString(),
});

const handleAuthEvent = (error: AppError) => {
  if (error.code === "AUTH_REFRESH_EXPIRED") {
    emitAuthEvent({ type: "SessionExpired" });
  }
};

const parsePayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text.length > 0 ? text : null;
};

const request = async <T>(
  method: string,
  url: string,
  body?: unknown,
  init?: RequestInit
): Promise<Result<T>> => {
  try {
    const response = await fetch(url, {
      ...init,
      method,
      headers: buildHeaders(init, body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const payload = await parsePayload(response);

    if (isProblemDetails(payload)) {
      const appError = toAppError(payload, response.status);
      handleAuthEvent(appError);
      return { ok: false, error: appError };
    }

    if (!response.ok) {
      const error: AppError = {
        code: "UNEXPECTED_ERROR",
        messageKey: "errors.unexpected",
        details: typeof payload === "string" ? payload : undefined,
        httpStatus: response.status,
        clientTimestamp: new Date().toISOString(),
      };
      return { ok: false, error };
    }

    return { ok: true, data: (payload as T) };
  } catch {
    const error = toNetworkError();
    handleAuthEvent(error);
    return { ok: false, error };
  }
};

export const get = async <T>(
  url: string,
  init?: RequestInit
): Promise<Result<T>> => request<T>("GET", url, undefined, init);

export const post = async <T>(
  url: string,
  body?: unknown,
  init?: RequestInit
): Promise<Result<T>> => request<T>("POST", url, body, init);

export const put = async <T>(
  url: string,
  body?: unknown,
  init?: RequestInit
): Promise<Result<T>> => request<T>("PUT", url, body, init);

export const del = async <T>(
  url: string,
  init?: RequestInit
): Promise<Result<T>> => request<T>("DELETE", url, undefined, init);


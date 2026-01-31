import axios, { AxiosError, type AxiosInstance } from "axios";
import type { AppError, Result } from "@ogrency/core";
import { isProblemDetails, toAppError } from "./problemDetails";

export type HttpClientConfig = {
  baseURL: string;
  headers?: Record<string, string>;
};

const unauthorizedError = (httpStatus?: number): AppError => ({
  code: "UNAUTHORIZED",
  messageKey: "errors.unauthorized",
  httpStatus,
  clientTimestamp: new Date().toISOString(),
});

const forbiddenError = (httpStatus?: number): AppError => ({
  code: "FORBIDDEN",
  messageKey: "errors.forbidden",
  httpStatus,
  clientTimestamp: new Date().toISOString(),
});

const networkError = (): AppError => ({
  code: "NETWORK_ERROR",
  messageKey: "errors.network",
  clientTimestamp: new Date().toISOString(),
});

export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
    });
  }

  async get<T>(url: string): Promise<Result<T>> {
    return await this.request<T>("get", url);
  }

  async post<T>(url: string, body?: unknown): Promise<Result<T>> {
    return await this.request<T>("post", url, body);
  }

  async put<T>(url: string, body?: unknown): Promise<Result<T>> {
    return await this.request<T>("put", url, body);
  }

  async delete<T>(url: string): Promise<Result<T>> {
    return await this.request<T>("delete", url);
  }

  private async request<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    body?: unknown
  ): Promise<Result<T>> {
    try {
      const response =
        method === "get" || method === "delete"
          ? await this.client[method]<T>(url)
          : await this.client[method]<T>(url, body);

      return { ok: true, data: response.data };
    } catch (e) {
      const err = e as AxiosError;

      if (!axios.isAxiosError(err)) {
        return { ok: false, error: networkError() };
      }

      const status = err.response?.status;
      const payload = err.response?.data;

      if (status === 401) return { ok: false, error: unauthorizedError(status) };
      if (status === 403) return { ok: false, error: forbiddenError(status) };

      if (isProblemDetails(payload)) {
        return { ok: false, error: toAppError(payload, status) };
      }

      // Unknown error response shape: keep it stable and non-throwing.
      const fallback: AppError = {
        code: "UNEXPECTED_ERROR",
        messageKey: "errors.unexpected",
        details:
          typeof payload === "string"
            ? payload
            : err.message || "Unexpected error",
        httpStatus: status,
        clientTimestamp: new Date().toISOString(),
      };

      return { ok: false, error: fallback };
    }
  }
}



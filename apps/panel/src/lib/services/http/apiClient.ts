import type { Result } from "@ogrency/core";
import { HttpClient } from "@ogrency/http";
import { apiUrl } from "../../../composition/config";

const httpClient = new HttpClient({
  baseURL: apiUrl,
});

export const get = async <T>(url: string): Promise<Result<T>> =>
  await httpClient.get<T>(url);

export const post = async <T>(url: string, body?: unknown): Promise<Result<T>> =>
  await httpClient.post<T>(url, body);

export const put = async <T>(url: string, body?: unknown): Promise<Result<T>> =>
  await httpClient.put<T>(url, body);

export const del = async <T>(url: string): Promise<Result<T>> =>
  await httpClient.delete<T>(url);


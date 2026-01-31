import type { AppError } from "../shared/types/foundation";

const isRecord = (payload: unknown): payload is Record<string, unknown> =>
  typeof payload === "object" && payload !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const extractValidationErrors = (
  payload: Record<string, unknown>
): Record<string, string[]> | undefined => {
  const raw =
    payload.validationErrors && isRecord(payload.validationErrors)
      ? payload.validationErrors
      : payload.errors && isRecord(payload.errors)
        ? payload.errors
        : undefined;

  if (!raw) return undefined;

  const normalized: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (isStringArray(value)) {
      normalized[key] = value;
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

export const isProblemDetails = (payload: unknown): boolean => {
  if (!isRecord(payload)) return false;

  return (
    "code" in payload ||
    "messageKey" in payload ||
    "errors" in payload ||
    "validationErrors" in payload ||
    "title" in payload ||
    "detail" in payload ||
    "traceId" in payload
  );
};

export const toAppError = (
  payload: unknown,
  httpStatus?: number
): AppError => {
  const base: AppError = {
    code: "UNEXPECTED_ERROR",
    messageKey: "errors.unexpected",
    clientTimestamp: new Date().toISOString(),
    httpStatus,
  };

  if (!isRecord(payload)) return base;

  const code =
    typeof payload.code === "string" ? payload.code : base.code;
  const messageKey =
    typeof payload.messageKey === "string"
      ? payload.messageKey
      : base.messageKey;
  const details = typeof payload.detail === "string" ? payload.detail : undefined;
  const traceId = typeof payload.traceId === "string" ? payload.traceId : undefined;
  const validationErrors = extractValidationErrors(payload);

  return {
    code,
    messageKey,
    details,
    traceId,
    httpStatus,
    clientTimestamp: base.clientTimestamp,
    validationErrors,
  };
};


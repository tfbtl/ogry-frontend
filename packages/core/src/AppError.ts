export type AppError = {
  code: string;
  messageKey: string;
  details?: string;
  traceId?: string;
  httpStatus?: number;
  clientTimestamp: string;
  validationErrors?: Record<string, string[]>;
};

export type UIFriendlyError = {
  title: string;
  description?: string;
  traceId?: string;
  fieldErrors?: Record<string, string[]>;
};



export const newCorrelationId = (): string => {
  return crypto.randomUUID();
};


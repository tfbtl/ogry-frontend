export type AuthEventType = "SessionExpired" | "LoggedOut";

export type AuthEvent = {
  type: AuthEventType;
};

type AuthEventHandler = (event: AuthEvent) => void;

const listeners = new Set<AuthEventHandler>();

export const emitAuthEvent = (event: AuthEvent) => {
  listeners.forEach((handler) => handler(event));
};

export const onAuthEvent = (handler: AuthEventHandler): (() => void) => {
  listeners.add(handler);
  return () => {
    listeners.delete(handler);
  };
};


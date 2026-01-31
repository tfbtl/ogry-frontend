import { queryClient } from "./queryClient";

const localResetters = new Set<() => void>();

export const registerAuthStateReset = (handler: () => void): (() => void) => {
  localResetters.add(handler);
  return () => {
    localResetters.delete(handler);
  };
};

export const authStateReset = () => {
  // NOTE: queryClient.clear() is aggressive and clears public cache as well.
  queryClient.clear();
  localResetters.forEach((handler) => handler());
};


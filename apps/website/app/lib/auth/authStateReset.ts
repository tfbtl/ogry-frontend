const localResetters = new Set<() => void>();

export const registerAuthStateReset = (handler: () => void): (() => void) => {
  localResetters.add(handler);
  return () => {
    localResetters.delete(handler);
  };
};

export const authStateReset = () => {
  localResetters.forEach((handler) => handler());
};


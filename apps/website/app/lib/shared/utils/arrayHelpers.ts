/**
 * Array Helper Utilities
 * 
 * Utility functions for array operations.
 */

/**
 * Ensures a value is an array, throws error if not
 */
export function ensureArrayData<T>(data: unknown, errorMessage: string): T[] {
  if (!Array.isArray(data)) {
    throw new Error(errorMessage);
  }
  return data as T[];
}


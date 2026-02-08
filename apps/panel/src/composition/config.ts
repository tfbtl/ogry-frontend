/**
 * Panel Configuration (Composition Root)
 * 
 * Single source of truth for environment variable reading.
 * 
 * Rules:
 * - ALL env reads happen ONLY in this file
 * - UI components must import from here, never raw env
 * - NO console logging
 */

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

/**
 * Backend API Configuration
 */
export const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Feature Flags
 */
export const featureFlags = {
  /**
   * Use Backend API for Cabins instead of Supabase
   * Default: false (Supabase active)
   */
  useBackendCabins: import.meta.env.VITE_USE_BACKEND_CABINS === "true",
};


/**
 * Website Configuration (Composition Root)
 * 
 * Single source of truth for environment variable reading.
 * 
 * Rules:
 * - ALL public env reads happen ONLY in this file
 * - Server-only secrets remain in app/_server/** (DO NOT TOUCH)
 * - UI components must import from here, never raw env
 * - NO console logging
 */

/**
 * Public Supabase Configuration
 * 
 * Note: Server-side Supabase config remains in app/_server/supabase.js
 * This is for browser/public client usage only.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Feature Flags
 */
export const featureFlags = {
  /**
   * Use Backend API for Cabins instead of Supabase
   * Default: false (Supabase active)
   */
  useBackendCabins: process.env.NEXT_PUBLIC_USE_BACKEND_CABINS === "true",
};


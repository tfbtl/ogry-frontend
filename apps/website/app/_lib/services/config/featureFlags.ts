/**
 * Feature Flags Configuration
 * 
 * Feature flags control provider selection and feature toggles.
 * Flags are read from environment variables.
 * 
 * Rules:
 * - Flags are read ONLY in adapter factories / composition roots
 * - UI layer should NEVER read feature flags directly
 * - NO console logging
 */

export const featureFlags = {
  /**
   * Use Backend API for Cabins instead of Supabase
   * Default: false (Supabase active)
   */
  useBackendCabins: process.env.NEXT_PUBLIC_USE_BACKEND_CABINS === "true",
};


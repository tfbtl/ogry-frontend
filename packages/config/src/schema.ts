/**
 * Canonical config schema (SSOT).
 * No env reading; types only.
 */

export interface ClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
  featureFlags: FeatureFlags;
}

export interface FeatureFlags {
  /** Use Backend API for Cabins instead of Supabase. Default false. */
  useBackendCabins: boolean;
}

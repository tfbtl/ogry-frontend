/**
 * Normalize env-like objects into canonical config.
 * This package does NOT read process.env or import.meta.env;
 * the caller (composition root) passes the env object.
 */

import type { ClientConfig, FeatureFlags } from "./schema";

/** Vite exposes import.meta.env with VITE_* keys. */
export interface ImportMetaEnvLike {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_API_URL?: string;
  VITE_USE_BACKEND_CABINS?: string;
  [key: string]: unknown;
}

/**
 * Normalize Vite client env (import.meta.env) to canonical client config.
 * Backward compat: VITE_SUPABASE_KEY used if VITE_SUPABASE_ANON_KEY not set.
 */
export function normalizeViteClientEnv(env: ImportMetaEnvLike): ClientConfig {
  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_KEY || "";
  return {
    supabaseUrl: env.VITE_SUPABASE_URL ?? "",
    supabaseAnonKey,
    apiUrl: env.VITE_API_URL ?? "",
    featureFlags: normalizeFeatureFlagsVite(env),
  };
}

function normalizeFeatureFlagsVite(env: ImportMetaEnvLike): FeatureFlags {
  return {
    useBackendCabins: env.VITE_USE_BACKEND_CABINS === "true",
  };
}

/**
 * Normalize Next.js public env (process.env subset) to canonical client config.
 */
export function normalizeNextPublicEnv(
  env: Record<string, string | undefined>
): ClientConfig {
  return {
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    apiUrl: env.NEXT_PUBLIC_API_URL ?? "",
    featureFlags: {
      useBackendCabins: env.NEXT_PUBLIC_USE_BACKEND_CABINS === "true",
    },
  };
}

/**
 * Placeholder for Next.js server-only env.
 * Rules: server-only secrets MUST be read only in server context (e.g. app/server/**).
 * This package does not read or define server secrets.
 */
export interface NextServerEnvPlaceholder {
  /** Server-only keys are NOT listed here to avoid leakage. Read in app/server/** only. */
  _placeholder?: true;
}

export function normalizeNextServerEnv(
  _env: Record<string, string | undefined>
): NextServerEnvPlaceholder {
  return {};
}

/**
 * Website Configuration (Composition Root)
 *
 * Single source of truth for public env reading.
 * Env is read here only, then normalized via @ogrency/config.
 *
 * Rules:
 * - ALL public env reads happen ONLY in this file
 * - Server-only secrets remain in app/server/** (DO NOT TOUCH)
 * - UI components must import from here, never raw env
 * - NO console logging
 */

import { normalizeNextPublicEnv } from "@ogrency/config";

const config = normalizeNextPublicEnv(process.env as Record<string, string | undefined>);

/**
 * Public Supabase Configuration
 *
 * Note: Server-side Supabase config remains in app/server/supabase.js
 * This is for browser/public client usage only.
 */
export const supabaseUrl = config.supabaseUrl;
export const supabaseAnonKey = config.supabaseAnonKey;

/**
 * Backend API Configuration
 */
export const apiUrl = config.apiUrl;

/**
 * Feature Flags
 */
export const featureFlags = config.featureFlags;


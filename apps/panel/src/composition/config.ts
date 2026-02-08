/**
 * Panel Configuration (Composition Root)
 *
 * Single source of truth for environment variable reading.
 * Env is read here only, then normalized via @ogrency/config.
 *
 * Rules:
 * - ALL env reads happen ONLY in this file
 * - UI components must import from here, never raw env
 * - NO console logging
 */

import { normalizeViteClientEnv } from "@ogrency/config";

const config = normalizeViteClientEnv(import.meta.env);

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


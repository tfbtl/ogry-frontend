/**
 * @deprecated Migration Pending — use _composition/config.ts
 * This file is kept for backward compatibility during migration.
 */
import { supabaseUrl, supabaseAnonKey } from "../../_composition/config";

export const supabasePublicConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
};


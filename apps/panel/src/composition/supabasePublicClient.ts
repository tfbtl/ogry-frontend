/**
 * Panel Public Supabase Client (Browser Singleton)
 * 
 * Exports a singleton public Supabase client for browser usage.
 * Uses @ogrency/supabase-public factory.
 * 
 * Rules:
 * - Browser/public client only
 * - Singleton export
 * - Config injected from composition/config.ts
 */

import { createSupabasePublicClient } from "@ogrency/supabase-public";
import { supabaseUrl, supabaseAnonKey } from "./config";

export const supabasePublicClient = createSupabasePublicClient({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
});


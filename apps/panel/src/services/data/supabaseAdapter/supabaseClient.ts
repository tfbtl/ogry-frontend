/**
 * Supabase Client Proxy
 * 
 * This file provides a canonical import point for all adapters.
 * It proxies the real Supabase client from the composition root.
 * 
 * Real Source: src/_composition/supabasePublicClient.ts
 * Export Shape: default export (supabase) + named export (supabaseUrl)
 */
import { supabasePublicClient } from "../../../_composition/supabasePublicClient";
import { supabaseUrl as configSupabaseUrl } from "../../../_composition/config";

export const supabaseUrl = configSupabaseUrl;
export { supabasePublicClient as supabase };


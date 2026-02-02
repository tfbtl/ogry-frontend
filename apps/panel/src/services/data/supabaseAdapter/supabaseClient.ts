/**
 * Supabase Client Proxy
 * 
 * This file provides a canonical import point for all adapters.
 * It proxies the real Supabase client from the services layer.
 * 
 * Real Source: src/services/supabasePublicClient.ts
 * Export Shape: default export (supabase) + named export (supabaseUrl)
 */
import { supabase } from "../../supabasePublicClient";
import { supabasePublicConfig } from "../../config/supabasePublicConfig";

export const supabaseUrl = supabasePublicConfig.url;
export { supabase };


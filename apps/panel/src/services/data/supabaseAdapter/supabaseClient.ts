/**
 * Supabase Client Proxy
 * 
 * This file provides a canonical import point for all adapters.
 * It proxies the real Supabase client from the services layer.
 * 
 * Real Source: src/services/supabase.js
 * Export Shape: default export (supabase) + named export (supabaseUrl)
 */
import supabase, { supabaseUrl } from "../../supabase";

export { supabase, supabaseUrl };


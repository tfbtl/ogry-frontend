/**
 * @deprecated Use supabasePublicClient.ts directly. Proxy kept for backward compatibility.
 */
import { supabase as supabaseClient } from "./supabasePublicClient";
import { supabasePublicConfig } from "./config/supabasePublicConfig";

export const supabaseUrl = supabasePublicConfig.url;

export default supabaseClient;

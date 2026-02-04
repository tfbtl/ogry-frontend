import { supabase as supabaseClient } from "./supabasePublicClient";
import { supabasePublicConfig } from "./config/supabasePublicConfig";

export const supabaseUrl = supabasePublicConfig.url;

export default supabaseClient;

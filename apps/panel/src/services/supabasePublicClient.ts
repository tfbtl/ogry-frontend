import { createSupabasePublicClient } from "@ogrency/supabase-public";
import { supabasePublicConfig } from "./config/supabasePublicConfig";

export const supabase = createSupabasePublicClient(supabasePublicConfig);


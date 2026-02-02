import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
  options?: any;
};

export function createSupabasePublicClient(
  config: SupabasePublicConfig
): SupabaseClient {
  return createClient(config.url, config.anonKey, config.options);
}


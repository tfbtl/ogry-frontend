/**
 * Legacy Supabase Export (Deprecated)
 * 
 * @deprecated Migration Pending — use @ogrency/cabins or _composition/supabasePublicClient
 * This file is kept for backward compatibility during migration.
 */
import { supabasePublicClient } from "../_composition/supabasePublicClient";
import { supabaseUrl } from "../_composition/config";

export { supabaseUrl };
export default supabasePublicClient;

import type { Result } from "../../shared/types/foundation";
import { ok } from "../../shared/utils/errorHelpers";
import { featureFlags } from "../config/featureFlags";

/**
 * Cabins Provider Check
 * 
 * Diagnostic helper to check which provider is active for Cabins.
 * 
 * Rules:
 * - NO network calls
 * - NO console logging
 * - Returns provider type based on feature flag only
 */
export async function checkCabinsProvider(): Promise<Result<"backend" | "supabase">> {
  if (featureFlags.useBackendCabins) {
    return ok("backend");
  }
  return ok("supabase");
}


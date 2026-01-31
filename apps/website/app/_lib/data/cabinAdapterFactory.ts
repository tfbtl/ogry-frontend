import type { ICabinService } from "../shared/interfaces/ICabinService";
import { CabinServiceAdapter } from "./supabaseAdapter/CabinServiceAdapter";
import { BackendCabinServiceAdapter } from "./backendAdapter/CabinServiceAdapter";
import { featureFlags } from "../services/config/featureFlags";

/**
 * Cabin Adapter Factory
 * 
 * This factory returns the appropriate ICabinService implementation
 * based on feature flags.
 * 
 * Rules:
 * - Feature flags are read ONLY here (not in UI or UseCases)
 * - Provider switch is transparent to UseCases
 * - NO console logging
 */
export function getCabinService(): ICabinService {
  if (featureFlags.useBackendCabins) {
    return new BackendCabinServiceAdapter();
  }
  return new CabinServiceAdapter();
}


import { getCabinService } from "../../data/cabinAdapterFactory";
import { GetCabinsUseCase } from "../../features/cabins/usecases/GetCabinsUseCase";
import { GetCabinUseCase } from "../../features/cabins/usecases/GetCabinUseCase";

/**
 * Composition Root for Cabin UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 * 
 * Provider selection is handled by cabinAdapterFactory based on feature flags.
 */
const cabinService = getCabinService();

export const getCabinsUseCase = new GetCabinsUseCase(cabinService);
export const getCabinUseCase = new GetCabinUseCase(cabinService);


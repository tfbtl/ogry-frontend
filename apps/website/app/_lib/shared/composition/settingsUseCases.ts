import { SettingsServiceAdapter } from "../../data/supabaseAdapter/SettingsServiceAdapter";
import { GetSettingsUseCase } from "../../features/settings/usecases/GetSettingsUseCase";
import { UpdateSettingsUseCase } from "../../features/settings/usecases/UpdateSettingsUseCase";

/**
 * Composition Root for Settings UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 */
const settingsService = new SettingsServiceAdapter();

export const getSettingsUseCase = new GetSettingsUseCase(settingsService);
export const updateSettingsUseCase = new UpdateSettingsUseCase(settingsService);


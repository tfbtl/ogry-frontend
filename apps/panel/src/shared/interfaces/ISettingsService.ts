import type { Result } from "../types/foundation";
import type { Settings, UpdateSettingsInput } from "../types/settings";

/**
 * ISettingsService - Abstraction for settings operations
 * 
 * This interface defines the contract for settings-related operations.
 * UI layer should NEVER import this interface directly.
 * Use UseCase layer instead.
 * 
 * Note: Settings is a SINGLETON, not a collection.
 */
export interface ISettingsService {
  /**
   * Retrieve settings (SINGLETON - single object, not array)
   * @returns Promise resolving to Result containing Settings object
   */
  getSettings(): Promise<Result<Settings>>;

  /**
   * Update settings (partial update, SINGLETON)
   * @param input - Settings update data (partial, only changed fields)
   * @returns Promise resolving to Result containing updated Settings object
   */
  updateSettings(input: UpdateSettingsInput): Promise<Result<Settings>>;
}


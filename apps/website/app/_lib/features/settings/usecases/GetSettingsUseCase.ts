import type { ISettingsService } from "../../shared/interfaces/ISettingsService";
import type { Result } from "../../shared/types/foundation";
import type { Settings } from "../../shared/types/settings";

/**
 * GetSettingsUseCase - Business logic for retrieving settings
 * 
 * This use case is the ONLY entry point for UI to get settings.
 * UI should never call ISettingsService directly.
 * 
 * Note: Settings is a SINGLETON, not a collection.
 */
export class GetSettingsUseCase {
  constructor(private readonly settingsService: ISettingsService) {}

  /**
   * Execute the use case
   * @returns Promise resolving to Result containing Settings object (SINGLETON)
   */
  async execute(): Promise<Result<Settings>> {
    return await this.settingsService.getSettings();
  }
}


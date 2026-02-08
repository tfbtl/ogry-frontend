import type { ISettingsService } from "../../../lib/shared/interfaces/ISettingsService";
import type { Result } from "@ogrency/core";
import type { Settings, UpdateSettingsInput } from "../../../lib/shared/types/settings";

/**
 * UpdateSettingsUseCase - Business logic for updating settings
 * 
 * This use case is the ONLY entry point for UI to update settings.
 * UI should never call ISettingsService directly.
 * 
 * Note: Settings is a SINGLETON, partial update is supported.
 */
export class UpdateSettingsUseCase {
  constructor(private readonly settingsService: ISettingsService) {}

  /**
   * Execute the use case
   * @param input - Settings update data (partial, only changed fields)
   * @returns Promise resolving to Result containing updated Settings object
   */
  async execute(input: UpdateSettingsInput): Promise<Result<Settings>> {
    return await this.settingsService.updateSettings(input);
  }
}


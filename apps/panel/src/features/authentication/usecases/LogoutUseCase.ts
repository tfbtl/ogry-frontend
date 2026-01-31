import type { IAuthService } from "../../../shared/interfaces/IAuthService";
import type { Result } from "../../../shared/types/foundation";

/**
 * LogoutUseCase - Business logic for ending user session
 * 
 * This use case is the ONLY entry point for UI to logout.
 * UI should never call IAuthService directly.
 */
export class LogoutUseCase {
  constructor(private readonly authService: IAuthService) {}

  /**
   * Execute the use case
   * @returns Promise resolving to Result<void> or error
   */
  async execute(): Promise<Result<void>> {
    return await this.authService.logout();
  }
}


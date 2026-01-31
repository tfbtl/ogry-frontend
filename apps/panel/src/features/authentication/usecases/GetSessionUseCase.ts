import type { IAuthService } from "../../../shared/interfaces/IAuthService";
import type { Result } from "../../../shared/types/foundation";
import type { AuthSession } from "../../../shared/types/auth";

/**
 * GetSessionUseCase - Business logic for retrieving current session
 * 
 * This use case is the ONLY entry point for UI to get session.
 * UI should never call IAuthService directly.
 */
export class GetSessionUseCase {
  constructor(private readonly authService: IAuthService) {}

  /**
   * Execute the use case
   * @returns Promise resolving to Result containing AuthSession or null (if no session)
   */
  async execute(): Promise<Result<AuthSession | null>> {
    return await this.authService.getSession();
  }
}


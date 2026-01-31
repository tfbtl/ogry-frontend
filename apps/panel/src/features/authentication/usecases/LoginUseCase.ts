import type { IAuthService } from "../../../shared/interfaces/IAuthService";
import type { Result } from "../../../shared/types/foundation";
import type { AuthSession, LoginInput } from "../../../shared/types/auth";

/**
 * LoginUseCase - Business logic for user authentication
 * 
 * This use case is the ONLY entry point for UI to login.
 * UI should never call IAuthService directly.
 */
export class LoginUseCase {
  constructor(private readonly authService: IAuthService) {}

  /**
   * Execute the use case
   * @param input - Login credentials
   * @returns Promise resolving to Result containing AuthSession or error
   */
  async execute(input: LoginInput): Promise<Result<AuthSession>> {
    return await this.authService.login(input);
  }
}


import type { IUserService } from "../../shared/interfaces/IUserService";
import type { Result } from "../../shared/types/foundation";
import type { UserProfile } from "../../shared/types/user";

/**
 * GetCurrentUserUseCase - Business logic for retrieving current user profile
 * 
 * This use case is the ONLY entry point for UI to get user profile.
 * UI should never call IUserService directly.
 * 
 * Note: This is User profile data, NOT Auth session data.
 * Website uses NextAuth, which has a different flow.
 */
export class GetCurrentUserUseCase {
  constructor(private readonly userService: IUserService) {}

  /**
   * Execute the use case
   * @returns Promise resolving to Result containing UserProfile or null (if no user)
   */
  async execute(): Promise<Result<UserProfile | null>> {
    return await this.userService.getCurrentUser();
  }
}


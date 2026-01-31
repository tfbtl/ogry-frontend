import type { IUserService } from "../../../shared/interfaces/IUserService";
import type { Result } from "../../../shared/types/foundation";
import type { UserProfile, UpdateUserInput } from "../../../shared/types/user";

/**
 * UpdateCurrentUserUseCase - Business logic for updating user profile
 * 
 * This use case is the ONLY entry point for UI to update user profile.
 * UI should never call IUserService directly.
 * 
 * Note: Avatar upload logic is handled in Adapter layer.
 * UseCase and UI do NOT know about storage details.
 */
export class UpdateCurrentUserUseCase {
  constructor(private readonly userService: IUserService) {}

  /**
   * Execute the use case
   * @param input - User update data (may include File for avatar upload)
   * @returns Promise resolving to Result containing updated UserProfile or error
   */
  async execute(input: UpdateUserInput): Promise<Result<UserProfile>> {
    return await this.userService.updateCurrentUser(input);
  }
}


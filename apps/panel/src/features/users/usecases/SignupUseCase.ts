import type { IUserService } from "../../../lib/shared/interfaces/IUserService";
import type { Result } from "@ogrency/core";
import type { UserProfile, SignupInput } from "../../../lib/shared/types/user";

/**
 * SignupUseCase - Business logic for user registration
 * 
 * This use case is the ONLY entry point for UI to signup.
 * UI should never call IUserService directly.
 * 
 * Note: This is User registration, NOT authentication.
 * Auth (login/session) is handled separately.
 */
export class SignupUseCase {
  constructor(private readonly userService: IUserService) {}

  /**
   * Execute the use case
   * @param input - Signup credentials and profile data
   * @returns Promise resolving to Result containing UserProfile or error
   */
  async execute(input: SignupInput): Promise<Result<UserProfile>> {
    return await this.userService.signup(input);
  }
}


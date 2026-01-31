import type { Result } from "../types/foundation";
import type { UserProfile, SignupInput, UpdateUserInput } from "../types/user";

/**
 * IUserService - Abstraction for user profile operations
 * 
 * This interface defines the contract for user-related operations.
 * UI layer should NEVER import this interface directly.
 * Use UseCase layer instead.
 * 
 * ⚠️ CRITICAL SEPARATION:
 * - IAuthService: Handles authentication (login, logout, session)
 * - IUserService: Handles user profile (signup, profile, preferences)
 * 
 * These are SEPARATE concerns and MUST NOT be mixed.
 */
export interface IUserService {
  /**
   * Create new user account (User registration, NOT Auth)
   * @param input - Signup credentials and profile data
   * @returns Promise resolving to Result containing UserProfile or error
   */
  signup(input: SignupInput): Promise<Result<UserProfile>>;

  /**
   * Get current user profile (Read Model)
   * @returns Promise resolving to Result containing UserProfile or null (if no user)
   */
  getCurrentUser(): Promise<Result<UserProfile | null>>;

  /**
   * Update current user profile (Write Model - partial update)
   * @param input - User update data (may include File for avatar upload)
   * @returns Promise resolving to Result containing updated UserProfile or error
   */
  updateCurrentUser(input: UpdateUserInput): Promise<Result<UserProfile>>;
}


import type { Result } from "../types/foundation";
import type { AuthSession, LoginInput } from "../types/auth";

/**
 * IAuthService - Abstraction for authentication operations
 * 
 * This interface defines the contract for auth-related operations.
 * UI layer should NEVER import this interface directly.
 * Use UseCase layer instead.
 * 
 * Note: Website uses NextAuth, which has a different flow.
 * This interface is for future backend migration.
 */
export interface IAuthService {
  /**
   * Authenticate user with email and password
   * @param input - Login credentials
   * @returns Promise resolving to Result containing AuthSession or error
   */
  login(input: LoginInput): Promise<Result<AuthSession>>;

  /**
   * End user session
   * @returns Promise resolving to Result<void> or error
   */
  logout(): Promise<Result<void>>;

  /**
   * Get current user session
   * @returns Promise resolving to Result containing AuthSession or null (if no session)
   */
  getSession(): Promise<Result<AuthSession | null>>;
}


import type { IUserService } from "../../shared/interfaces/IUserService";
import type { Result } from "../../shared/types/foundation";
import type { UserProfile, SignupInput, UpdateUserInput } from "../../shared/types/user";
import { ok, err, errorFromException, handleAuthError, createAppError } from "../../shared/utils/errorHelpers";
import { auth } from "../../auth";

/**
 * UserServiceAdapter - NextAuth implementation of IUserService
 * 
 * This adapter wraps NextAuth for future backend migration.
 * Currently, NextAuth handles auth differently, so this is a placeholder
 * that returns NOT_IMPLEMENTED for most operations.
 * 
 * Note: Website uses NextAuth which has its own session management.
 * This adapter is prepared for future backend API migration.
 */
export class UserServiceAdapter implements IUserService {
  async signup(input: SignupInput): Promise<Result<UserProfile>> {
    // NextAuth uses OAuth providers, not email/password signup
    // This is a placeholder for future backend migration
    const appError = handleAuthError(
      errorFromException(
        new Error("Email/password signup not supported in website (uses NextAuth)"),
        "NOT_IMPLEMENTED",
        501
      )
    );
    return err(appError);
  }

  async getCurrentUser(): Promise<Result<UserProfile | null>> {
    try {
      const session = await auth();

      if (!session) {
        return ok(null);
      }

      // Convert NextAuth session to UserProfile format
      const userProfile: UserProfile = {
        id: session.user?.email || "",
        email: session.user?.email || "",
        role: "authenticated",
        user_metadata: {
          fullName: session.user?.name || undefined,
          avatar: session.user?.image || undefined,
        },
      };

      return ok(userProfile);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "USER_LOAD_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async updateCurrentUser(input: UpdateUserInput): Promise<Result<UserProfile>> {
    // NextAuth handles profile updates via its own mechanisms
    // This is a placeholder for future backend migration
    const appError = handleAuthError(
      errorFromException(
        new Error("Update user profile handled by NextAuth"),
        "NOT_IMPLEMENTED",
        501
      )
    );
    return err(appError);
  }
}


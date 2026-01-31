import type { IAuthService } from "../../shared/interfaces/IAuthService";
import type { Result } from "../../shared/types/foundation";
import type { AuthSession, LoginInput } from "../../shared/types/auth";
import { ok, err, errorFromException, handleAuthError } from "../../shared/utils/errorHelpers";
import { auth } from "../../auth";

/**
 * AuthServiceAdapter - NextAuth implementation of IAuthService
 * 
 * This adapter wraps NextAuth for future backend migration.
 * Currently, NextAuth handles auth differently, so this is a placeholder
 * that returns NOT_IMPLEMENTED for most operations.
 * 
 * Note: Website uses NextAuth which has its own session management.
 * This adapter is prepared for future backend API migration.
 */
export class AuthServiceAdapter implements IAuthService {
  async login(input: LoginInput): Promise<Result<AuthSession>> {
    // NextAuth uses OAuth providers, not email/password
    // This is a placeholder for future backend migration
    const appError = handleAuthError(
      errorFromException(
        new Error("Email/password login not supported in website (uses NextAuth)"),
        "NOT_IMPLEMENTED",
        501
      )
    );
    return err(appError);
  }

  async logout(): Promise<Result<void>> {
    // NextAuth handles logout via signOut()
    // This is a placeholder for future backend migration
    const appError = handleAuthError(
      errorFromException(
        new Error("Logout handled by NextAuth signOut()"),
        "NOT_IMPLEMENTED",
        501
      )
    );
    return err(appError);
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    try {
      const session = await auth();

      if (!session) {
        return ok(null);
      }

      // Convert NextAuth session to AuthSession format
      // Note: NextAuth doesn't expose tokens directly for security
      // This is a simplified mapping for future backend migration
      const authSession: AuthSession = {
        session: {
          access_token: "", // NextAuth doesn't expose this
          refresh_token: "", // NextAuth doesn't expose this
          token_type: "bearer",
        },
        user: {
          id: session.user?.email || "",
          email: session.user?.email || "",
          role: "authenticated",
          user_metadata: {
            fullName: session.user?.name || undefined,
            avatar: session.user?.image || undefined,
          },
        },
      };

      return ok(authSession);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "SESSION_ERROR",
          500
        )
      );
      return err(appError);
    }
  }
}


import type { IAuthService } from "../../../shared/interfaces/IAuthService";
import type { Result } from "../../../shared/types/foundation";
import type { AuthSession, LoginInput } from "../../../shared/types/auth";
import { ok, err, errorFromException, handleAuthError } from "../../../shared/utils/errorHelpers";
import { supabase } from "./supabaseClient";

/**
 * AuthServiceAdapter - Supabase Auth implementation of IAuthService
 * 
 * This adapter wraps the existing Supabase Auth logic and adapts it to
 * the IAuthService interface. Legacy data shape is preserved.
 */
export class AuthServiceAdapter implements IAuthService {
  async login(input: LoginInput): Promise<Result<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        // Check if it's an authentication error (401)
        if (error.status === 401 || error.message.includes("Invalid") || error.message.includes("credentials")) {
          const appError = handleAuthError(
            errorFromException(
              new Error(error.message || "Invalid email or password"),
              "UNAUTHORIZED",
              401
            )
          );
          return err(appError);
        }

        const appError = handleAuthError(
          errorFromException(
            new Error(error.message || "Login failed"),
            "LOGIN_ERROR",
            500
          )
        );
        return err(appError);
      }

      if (!data.session || !data.user) {
        const appError = handleAuthError(
          errorFromException(
            new Error("Login failed: No session data"),
            "LOGIN_ERROR",
            500
          )
        );
        return err(appError);
      }

      const authSession: AuthSession = {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type || "bearer",
        },
        user: {
          id: data.user.id,
          email: data.user.email || "",
          role: data.user.role,
          user_metadata: data.user.user_metadata,
          app_metadata: data.user.app_metadata,
        },
      };

      return ok(authSession);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "LOGIN_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error(error.message || "Logout failed"),
            "LOGOUT_ERROR",
            500
          )
        );
        return err(appError);
      }

      return ok(undefined);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "LOGOUT_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        const appError = handleAuthError(
          errorFromException(
            new Error(sessionError.status === 401 ? "Session expired" : sessionError.message || "Failed to get session"),
            sessionError.status === 401 ? "UNAUTHORIZED" : "SESSION_ERROR",
            sessionError.status === 401 ? 401 : 500
          )
        );
        return err(appError);
      }

      // No active session
      if (!sessionData?.session) {
        return ok(null);
      }

      // Get user data
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        const appError = handleAuthError(
          errorFromException(
            new Error(userError.status === 401 ? "Session expired" : userError.message || "Failed to get user"),
            userError.status === 401 ? "UNAUTHORIZED" : "SESSION_ERROR",
            userError.status === 401 ? 401 : 500
          )
        );
        return err(appError);
      }

      if (!userData?.user) {
        return ok(null);
      }

      const authSession: AuthSession = {
        session: {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_at: sessionData.session.expires_at,
          expires_in: sessionData.session.expires_in,
          token_type: sessionData.session.token_type || "bearer",
        },
        user: {
          id: userData.user.id,
          email: userData.user.email || "",
          role: userData.user.role,
          user_metadata: userData.user.user_metadata,
          app_metadata: userData.user.app_metadata,
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


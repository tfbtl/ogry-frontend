import type { IUserService } from "../../shared/interfaces/IUserService";
import type { Result } from "@ogrency/core";
import type { UserProfile, SignupInput, UpdateUserInput } from "../../shared/types/user";
import { ok, err, errorFromException, handleAuthError, createAppError } from "../../shared/utils/errorHelpers";
import { auth } from "../../../server/auth";
import { supabase } from "../../../server/supabase";

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

  // Guest operations (legacy support)
  async getGuestByEmail(email: string): Promise<Result<unknown | null>> {
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ok(null);
        }
        return err(
          errorFromException(
            new Error("Guest could not be loaded"),
            "GUEST_LOAD_ERROR",
            500
          )
        );
      }

      return ok(data);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "GUEST_LOAD_ERROR",
          500
        )
      );
    }
  }

  async createGuest(input: { email: string; fullName?: string }): Promise<Result<unknown>> {
    try {
      const { data, error } = await supabase
        .from("guests")
        .insert([input])
        .select()
        .single();

      if (error) {
        return err(
          errorFromException(
            new Error("Guest could not be created"),
            "GUEST_CREATE_ERROR",
            500
          )
        );
      }

      return ok(data);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "GUEST_CREATE_ERROR",
          500
        )
      );
    }
  }

  async updateGuest(id: string | number, input: Partial<{ nationality?: string; countryFlag?: string; nationalID?: string }>): Promise<Result<unknown>> {
    try {
      const { data, error } = await supabase
        .from("guests")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return err(
          errorFromException(
            new Error("Guest could not be updated"),
            "GUEST_UPDATE_ERROR",
            500
          )
        );
      }

      return ok(data);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "GUEST_UPDATE_ERROR",
          500
        )
      );
    }
  }
}


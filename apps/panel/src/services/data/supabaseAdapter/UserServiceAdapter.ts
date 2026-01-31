import type { IUserService } from "../../../shared/interfaces/IUserService";
import type { Result } from "../../../shared/types/foundation";
import type { UserProfile, SignupInput, UpdateUserInput } from "../../../shared/types/user";
import { ok, err, errorFromException, handleAuthError, createAppError } from "../../../shared/utils/errorHelpers";
import { supabase, supabaseUrl } from "./supabaseClient";

/**
 * UserServiceAdapter - Supabase implementation of IUserService
 * 
 * This adapter wraps the existing Supabase logic and adapts it to
 * the IUserService interface.
 * 
 * ⚠️ CRITICAL GUARDRAIL — AVATAR & STORAGE:
 * - Avatar upload logic is ENTIRELY contained within this adapter
 * - UseCase and UI do NOT know about storage details
 * - File → URL conversion happens here
 * - Backend migration: This logic can be swapped via adapter replacement
 */
export class UserServiceAdapter implements IUserService {
  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
  }

  private getUserId(payload: unknown): string | null {
    if (!this.isRecord(payload) || !this.isRecord(payload.user)) return null;
    const id = payload.user.id;
    return typeof id === "string" ? id : null;
  }

  async signup(input: SignupInput): Promise<Result<UserProfile>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            fullName: input.fullName,
            avatar: "",
          },
        },
      });

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error(error.message || "Signup failed"),
            "SIGNUP_ERROR",
            500
          )
        );
        return err(appError);
      }

      if (!data.user) {
        const appError = handleAuthError(
          createAppError("SIGNUP_ERROR", "Signup failed: No user data", undefined, 500)
        );
        return err(appError);
      }

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || "",
        role: data.user.role,
        user_metadata: data.user.user_metadata,
        app_metadata: data.user.app_metadata,
      };

      return ok(userProfile);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "SIGNUP_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async getCurrentUser(): Promise<Result<UserProfile | null>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return ok(null); // No session = no user
      }

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error(error.message || "Failed to get user"),
            error.status === 401 ? "UNAUTHORIZED" : "USER_LOAD_ERROR",
            error.status === 401 ? 401 : 500
          )
        );
        return err(appError);
      }

      if (!data?.user) {
        return ok(null);
      }

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || "",
        role: data.user.role,
        user_metadata: data.user.user_metadata,
        app_metadata: data.user.app_metadata,
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
    try {
      // 1. Handle password OR fullName update (if provided)
      let updateData: { password?: string; data?: { fullName?: string } } | undefined;
      
      if (input.password) {
        updateData = { password: input.password };
      } else if (input.fullName) {
        updateData = { data: { fullName: input.fullName } };
      }

      // Update user if password or fullName provided
      if (updateData) {
        const { data: updatedData, error: updateError } = await supabase.auth.updateUser(updateData);
        
        if (updateError) {
          const appError = handleAuthError(
            errorFromException(
              new Error(updateError.message || "User could not be updated"),
              "USER_UPDATE_ERROR",
              500
            )
          );
          return err(appError);
        }

        // If no avatar, return updated user
        if (!input.avatar) {
          if (!updatedData?.user) {
            const appError = handleAuthError(
              createAppError("USER_UPDATE_ERROR", "User could not be updated", undefined, 500)
            );
            return err(appError);
          }

          const userProfile: UserProfile = {
            id: updatedData.user.id,
            email: updatedData.user.email || "",
            role: updatedData.user.role,
            user_metadata: updatedData.user.user_metadata,
            app_metadata: updatedData.user.app_metadata,
          };

          return ok(userProfile);
        }
      }

      // 2. Handle avatar upload (if provided)
      if (input.avatar) {
        // Get current user ID
        const { data: currentUserData } = await supabase.auth.getUser();
        const userId = currentUserData?.user?.id;

        if (!userId) {
          const appError = handleAuthError(
            createAppError("USER_UPDATE_ERROR", "User could not be updated", undefined, 500)
          );
          return err(appError);
        }

        let avatarUrl: string;

        // If avatar is already a URL (string), use it directly
        if (typeof input.avatar === "string") {
          avatarUrl = input.avatar;
        } else {
          // ⚠️ CRITICAL: Avatar upload logic is ENTIRELY in adapter
          // UseCase and UI do NOT know about storage details
          const fileName = `avatar-${userId}-${Math.random()}`;

          const { error: storageError } = await supabase.storage
            .from("avatars")
            .upload(fileName, input.avatar);

          if (storageError) {
            const appError = handleAuthError(
              errorFromException(
                new Error(storageError.message || "Avatar could not be uploaded"),
                "AVATAR_UPLOAD_ERROR",
                500
              )
            );
            return err(appError);
          }

          avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
        }

        // 3. Update avatar in user metadata
        const { data: finalUserData, error: avatarUpdateError } = await supabase.auth.updateUser({
          data: {
            avatar: avatarUrl,
          },
        });

        if (avatarUpdateError) {
          const appError = handleAuthError(
            errorFromException(
              new Error(avatarUpdateError.message || "Avatar could not be updated"),
              "USER_UPDATE_ERROR",
              500
            )
          );
          return err(appError);
        }

        if (!finalUserData?.user) {
          const appError = handleAuthError(
            createAppError("USER_UPDATE_ERROR", "User could not be updated", undefined, 500)
          );
          return err(appError);
        }

        const userProfile: UserProfile = {
          id: finalUserData.user.id,
          email: finalUserData.user.email || "",
          role: finalUserData.user.role,
          user_metadata: finalUserData.user.user_metadata,
          app_metadata: finalUserData.user.app_metadata,
        };

        return ok(userProfile);
      }

      // If no updates provided, return current user
      return await this.getCurrentUser();
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "USER_UPDATE_ERROR",
          500
        )
      );
      return err(appError);
    }
  }
}


import type { ISettingsService } from "../../shared/interfaces/ISettingsService";
import type { Result } from "../../shared/types/foundation";
import type { Settings, UpdateSettingsInput } from "../../shared/types/settings";
import { ok, err, errorFromException, handleAuthError, createAppError } from "../../shared/utils/errorHelpers";
import { supabase } from "../../supabase";

/**
 * SettingsServiceAdapter - Supabase implementation of ISettingsService
 * 
 * This adapter wraps the existing Supabase logic and adapts it to
 * the ISettingsService interface.
 * 
 * ⚠️ GUARDRAIL: Settings is SINGLETON, must use .single()
 * Supabase defaults to returning arrays, but Settings is a single object.
 */
export class SettingsServiceAdapter implements ISettingsService {
  async getSettings(): Promise<Result<Settings>> {
    try {
      // ⚠️ CRITICAL: .single() MUST be used - Settings is SINGLETON, not array
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error("Settings could not be loaded"),
            "SETTINGS_LOAD_ERROR",
            500
          )
        );
        return err(appError);
      }

      // ⚠️ GUARDRAIL: data is object, NOT array
      // If somehow array is returned, this will fail at runtime
      // but type system ensures Settings (not Settings[])
      return ok(data as Settings);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "SETTINGS_LOAD_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async updateSettings(input: UpdateSettingsInput): Promise<Result<Settings>> {
    try {
      // ⚠️ CRITICAL: .single() MUST be used - Settings is SINGLETON
      // Settings table has only ONE row with id=1
      const { data, error } = await supabase
        .from("settings")
        .update(input)
        .eq("id", 1)
        .select()
        .single();

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error("Settings could not be updated"),
            "SETTINGS_UPDATE_ERROR",
            500
          )
        );
        return err(appError);
      }

      // ⚠️ GUARDRAIL: data is object, NOT array
      return ok(data as Settings);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "SETTINGS_UPDATE_ERROR",
          500
        )
      );
      return err(appError);
    }
  }
}


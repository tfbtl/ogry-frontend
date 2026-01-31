import type { ICabinService } from "../../shared/interfaces/ICabinService";
import type { Result } from "../../shared/types/foundation";
import type { Cabin, CreateCabinInput, UpdateCabinInput } from "../../shared/types/cabin";
import { ok, err, errorFromException } from "../../shared/utils/errorHelpers";
import { supabase } from "../../supabase";

/**
 * CabinServiceAdapter - Supabase implementation of ICabinService
 * 
 * This adapter wraps the existing Supabase logic and adapts it to
 * the ICabinService interface. Legacy data shape is preserved.
 */
export class CabinServiceAdapter implements ICabinService {
  async getCabins(): Promise<Result<Cabin[]>> {
    try {
      const { data, error } = await supabase
        .from("cabins")
        .select("id, name, maxCapacity, regularPrice, discount, image")
        .order("name");

      if (error) {
        return err(
          errorFromException(
            new Error("Cabins could not be loaded"),
            "CABINS_LOAD_ERROR",
            500
          )
        );
      }

      return ok((data || []) as Cabin[]);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "CABINS_LOAD_ERROR",
          500
        )
      );
    }
  }

  async getCabin(id: string | number): Promise<Result<Cabin>> {
    try {
      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return err(
            errorFromException(
              new Error("Cabin not found"),
              "CABIN_NOT_FOUND",
              404
            )
          );
        }
        return err(
          errorFromException(
            new Error("Cabin could not be loaded"),
            "CABIN_LOAD_ERROR",
            500
          )
        );
      }

      return ok(data as Cabin);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "CABIN_LOAD_ERROR",
          500
        )
      );
    }
  }

  async createCabin(input: CreateCabinInput): Promise<Result<Cabin>> {
    // Not implemented in website (read-only)
    return err(
      errorFromException(
        new Error("Create cabin not supported in website"),
        "NOT_IMPLEMENTED",
        501
      )
    );
  }

  async updateCabin(id: string | number, input: UpdateCabinInput): Promise<Result<Cabin>> {
    // Not implemented in website (read-only)
    return err(
      errorFromException(
        new Error("Update cabin not supported in website"),
        "NOT_IMPLEMENTED",
        501
      )
    );
  }

  async deleteCabin(id: string | number): Promise<Result<void>> {
    // Not implemented in website (read-only)
    return err(
      errorFromException(
        new Error("Delete cabin not supported in website"),
        "NOT_IMPLEMENTED",
        501
      )
    );
  }
}


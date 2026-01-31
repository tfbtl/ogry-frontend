import type { ICabinService } from "../../../shared/interfaces/ICabinService";
import type { Result } from "../../../shared/types/foundation";
import type { Cabin, CreateCabinInput, UpdateCabinInput } from "../../../shared/types/cabin";
import { ok, err, errorFromException } from "../../../shared/utils/errorHelpers";
import { supabase, supabaseUrl } from "./supabaseClient";

/**
 * CabinServiceAdapter - Supabase implementation of ICabinService
 * 
 * This adapter wraps the existing Supabase logic and adapts it to
 * the ICabinService interface. Legacy data shape is preserved.
 */
export class CabinServiceAdapter implements ICabinService {
  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
  }

  private getCabinId(payload: unknown): string | number | null {
    if (!this.isRecord(payload)) return null;
    const id = payload.id;
    return typeof id === "number" || typeof id === "string" ? id : null;
  }

  async getCabins(): Promise<Result<Cabin[]>> {
    try {
      const { data, error } = await supabase.from("cabins").select("*");

      if (error) {
        return err(
          errorFromException(
            new Error("Cabins could not be loaded"),
            "CABINS_LOAD_ERROR",
            500
          )
        );
      }

      return ok(data as Cabin[]);
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
    try {
      const hasImagePath = typeof input.image === "string" && input.image.startsWith(supabaseUrl);

      const imageName = typeof input.image === "string"
        ? input.image
        : `${Math.random()}-${input.image.name}`.replaceAll("/", "");

      const imagePath = hasImagePath
        ? input.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

      // 1. Create cabin
      const { data, error } = await supabase
        .from("cabins")
        .insert([{ ...input, image: imagePath }])
        .select()
        .single();

      if (error) {
        return err(
          errorFromException(
            new Error("Cabin could not be created"),
            "CABIN_CREATE_ERROR",
            500
          )
        );
      }

      // 2. Upload image if needed
      if (hasImagePath || typeof input.image === "string") {
        return ok(data as Cabin);
      }

      const cabinId = this.getCabinId(data);
      if (cabinId === null) {
        return err(
          errorFromException(
            new Error("Cabin could not be created"),
            "CABIN_CREATE_ERROR",
            500
          )
        );
      }

      const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, input.image);

      // 3. Delete the cabin IF there was an error uploading image
      if (storageError) {
        await supabase.from("cabins").delete().eq("id", cabinId);
        return err(
          errorFromException(
            new Error("Cabin image could not be uploaded and the cabin was not created"),
            "CABIN_IMAGE_UPLOAD_ERROR",
            500
          )
        );
      }

      return ok(data as Cabin);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "CABIN_CREATE_ERROR",
          500
        )
      );
    }
  }

  async updateCabin(id: string | number, input: UpdateCabinInput): Promise<Result<Cabin>> {
    try {
      const hasImagePath = input.image && typeof input.image === "string" && input.image.startsWith(supabaseUrl);

      const imageName = input.image && typeof input.image === "string"
        ? input.image
        : input.image
        ? `${Math.random()}-${input.image.name}`.replaceAll("/", "")
        : undefined;

      const imagePath = hasImagePath
        ? input.image as string
        : imageName
        ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
        : undefined;

      const updateData = imagePath ? { ...input, image: imagePath } : input;

      // 1. Update cabin
      const { data, error } = await supabase
        .from("cabins")
        .update(updateData)
        .eq("id", id)
        .select()
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
            new Error("Cabin could not be updated"),
            "CABIN_UPDATE_ERROR",
            500
          )
        );
      }

      // 2. Upload image if needed
      if (!input.image || hasImagePath || typeof input.image === "string") {
        return ok(data as Cabin);
      }

      const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName!, input.image);

      if (storageError) {
        // Note: We don't rollback the update, just log the error
        // In production, you might want to handle this differently
        return err(
          errorFromException(
            new Error("Cabin updated but image could not be uploaded"),
            "CABIN_IMAGE_UPLOAD_ERROR",
            500
          )
        );
      }

      return ok(data as Cabin);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "CABIN_UPDATE_ERROR",
          500
        )
      );
    }
  }

  async deleteCabin(id: string | number): Promise<Result<void>> {
    try {
      const { error } = await supabase.from("cabins").delete().eq("id", id);

      if (error) {
        return err(
          errorFromException(
            new Error("Cabin could not be deleted"),
            "CABIN_DELETE_ERROR",
            500
          )
        );
      }

      return ok(undefined);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "CABIN_DELETE_ERROR",
          500
        )
      );
    }
  }
}


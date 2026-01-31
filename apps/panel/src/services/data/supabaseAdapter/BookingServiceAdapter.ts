import type { IBookingService } from "../../../shared/interfaces/IBookingService";
import type { Result } from "../../../shared/types/foundation";
import type { Booking, BookingInput } from "../../../shared/types/booking";
import { ok, err, errorFromException, handleAuthError, createAppError } from "../../../shared/utils/errorHelpers";
import { supabase } from "./supabaseClient";
import { PAGE_SIZE } from "../../../utils/constants";

/**
 * BookingServiceAdapter - Supabase implementation of IBookingService
 * 
 * This adapter wraps the existing Supabase logic and adapts it to
 * the IBookingService interface. JOIN'li nested structure is preserved
 * for UI compatibility (Read Model).
 */
export class BookingServiceAdapter implements IBookingService {
  async getBookings(options?: {
    filter?: { field: string; value: unknown; method?: string };
    sortBy?: { field: string; direction: "asc" | "desc" };
    page?: number;
  }): Promise<Result<Booking[]>> {
    try {
      let query = supabase
        .from("bookings")
        .select(
          "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
          { count: "exact" }
        );

      // FILTER
      if (options?.filter) {
        const method = options.filter.method || "eq";
        query = query[method](options.filter.field, options.filter.value);
      }

      // SORT
      if (options?.sortBy) {
        query = query.order(options.sortBy.field, {
          ascending: options.sortBy.direction === "asc",
        });
      }

      // PAGINATION
      if (options?.page) {
        const from = (options.page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error("Bookings could not be loaded"),
            "BOOKINGS_LOAD_ERROR",
            500
          )
        );
        return err(appError);
      }

      return ok((data || []) as Booking[]);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKINGS_LOAD_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async getBooking(id: string | number): Promise<Result<Booking>> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const appError = handleAuthError(
            createAppError("BOOKING_NOT_FOUND", "Booking not found", undefined, 404)
          );
          return err(appError);
        }
        const appError = handleAuthError(
          errorFromException(
            new Error("Booking could not be loaded"),
            "BOOKING_LOAD_ERROR",
            500
          )
        );
        return err(appError);
      }

      return ok(data as Booking);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_LOAD_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async updateBooking(id: string | number, input: BookingInput): Promise<Result<Booking>> {
    try {
      // Write Model: Only flat fields, no nested objects
      const { data, error } = await supabase
        .from("bookings")
        .update(input)
        .eq("id", id)
        .select("*, cabins(*), guests(*)") // Return Read Model after update
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const appError = handleAuthError(
            createAppError("BOOKING_NOT_FOUND", "Booking not found", undefined, 404)
          );
          return err(appError);
        }
        const appError = handleAuthError(
          errorFromException(
            new Error("Booking could not be updated"),
            "BOOKING_UPDATE_ERROR",
            500
          )
        );
        return err(appError);
      }

      return ok(data as Booking);
    } catch (error) {
      const appError = handleAuthError(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_UPDATE_ERROR",
          500
        )
      );
      return err(appError);
    }
  }

  async deleteBooking(id: string | number): Promise<Result<void>> {
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) {
        const appError = handleAuthError(
          errorFromException(
            new Error("Booking could not be deleted"),
            "BOOKING_DELETE_ERROR",
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
          "BOOKING_DELETE_ERROR",
          500
        )
      );
      return err(appError);
    }
  }
}


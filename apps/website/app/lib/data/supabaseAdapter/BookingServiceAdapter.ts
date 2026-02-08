import type { IBookingService } from "../../shared/interfaces/IBookingService";
import type { Result } from "@ogrency/core";
import type { Booking, BookingInput } from "../../shared/types/booking";
import { ok, err, errorFromException } from "../../shared/utils/errorHelpers";
import { supabase } from "../../../server/supabase";

/**
 * BookingServiceAdapter - Supabase implementation of IBookingService
 * 
 * This adapter wraps the existing Supabase logic and adapts it to
 * the IBookingService interface.
 */
export class BookingServiceAdapter implements IBookingService {
  async getBooking(id: string | number): Promise<Result<Booking>> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return err(
            errorFromException(
              new Error("Booking not found"),
              "BOOKING_NOT_FOUND",
              404
            )
          );
        }
        return err(
          errorFromException(
            new Error("Booking could not be loaded"),
            "BOOKING_LOAD_ERROR",
            500
          )
        );
      }

      return ok(data as Booking);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_LOAD_ERROR",
          500
        )
      );
    }
  }

  async getBookingsByGuestId(guestId: string | number): Promise<Result<Booking[]>> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
        )
        .eq("guestId", guestId)
        .order("startDate");

      if (error) {
        return err(
          errorFromException(
            new Error("Bookings could not be loaded"),
            "BOOKINGS_LOAD_ERROR",
            500
          )
        );
      }

      // Map Supabase response to Booking type (cabins is array from JOIN, convert to object)
      const bookings = (data || []).map((item: any) => ({
        ...item,
        cabins: Array.isArray(item.cabins) && item.cabins.length > 0 ? item.cabins[0] : item.cabins,
      }));

      return ok(bookings as Booking[]);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKINGS_LOAD_ERROR",
          500
        )
      );
    }
  }

  async getBookedDates(cabinId: string | number, today: string): Promise<Result<unknown[]>> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("cabinId", cabinId)
        .or(`startDate.gte.${today},status.eq.checked-in`);

      if (error) {
        return err(
          errorFromException(
            new Error("Booked dates could not be loaded"),
            "BOOKED_DATES_LOAD_ERROR",
            500
          )
        );
      }

      return ok((data || []) as unknown[]);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKED_DATES_LOAD_ERROR",
          500
        )
      );
    }
  }

  async createBooking(input: BookingInput): Promise<Result<Booking>> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([input])
        .select()
        .single();

      if (error) {
        return err(
          errorFromException(
            new Error("Booking could not be created"),
            "BOOKING_CREATE_ERROR",
            500
          )
        );
      }

      return ok(data as Booking);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_CREATE_ERROR",
          500
        )
      );
    }
  }

  async createBookingBasic(input: BookingInput): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from("bookings")
        .insert([input]);

      if (error) {
        return err(
          errorFromException(
            new Error("Booking could not be created"),
            "BOOKING_CREATE_ERROR",
            500
          )
        );
      }

      return ok(undefined);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_CREATE_ERROR",
          500
        )
      );
    }
  }

  async updateBooking(id: string | number, input: Partial<BookingInput>): Promise<Result<Booking>> {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return err(
          errorFromException(
            new Error("Booking could not be updated"),
            "BOOKING_UPDATE_ERROR",
            500
          )
        );
      }

      return ok(data as Booking);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_UPDATE_ERROR",
          500
        )
      );
    }
  }

  async deleteBooking(id: string | number): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

      if (error) {
        return err(
          errorFromException(
            new Error("Booking could not be deleted"),
            "BOOKING_DELETE_ERROR",
            500
          )
        );
      }

      return ok(undefined);
    } catch (error) {
      return err(
        errorFromException(
          error instanceof Error ? error : new Error("Unknown error"),
          "BOOKING_DELETE_ERROR",
          500
        )
      );
    }
  }
}


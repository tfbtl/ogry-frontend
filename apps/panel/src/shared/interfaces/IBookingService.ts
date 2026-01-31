import type { Result } from "../types/foundation";
import type { Booking, BookingInput } from "../types/booking";

/**
 * IBookingService - Abstraction for booking data operations
 * 
 * This interface defines the contract for booking-related operations.
 * UI layer should NEVER import this interface directly.
 * Use UseCase layer instead.
 */
export interface IBookingService {
  /**
   * Retrieve all bookings (Read Model with JOINs)
   * @param options - Query options (filter, sort, pagination)
   * @returns Promise resolving to Result containing array of bookings
   */
  getBookings(options?: {
    filter?: { field: string; value: unknown; method?: string };
    sortBy?: { field: string; direction: "asc" | "desc" };
    page?: number;
  }): Promise<Result<Booking[]>>;

  /**
   * Retrieve a single booking by ID (Read Model with JOINs)
   * @param id - Booking identifier
   * @returns Promise resolving to Result containing booking or error
   */
  getBooking(id: string | number): Promise<Result<Booking>>;

  /**
   * Update an existing booking (Write Model - IDs only)
   * @param id - Booking identifier
   * @param input - Booking update data (normalized, no nested objects)
   * @returns Promise resolving to Result containing updated booking (Read Model) or error
   */
  updateBooking(id: string | number, input: BookingInput): Promise<Result<Booking>>;

  /**
   * Delete a booking by ID
   * @param id - Booking identifier
   * @returns Promise resolving to Result<void> or error
   */
  deleteBooking(id: string | number): Promise<Result<void>>;
}


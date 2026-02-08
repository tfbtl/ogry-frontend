import type { Result } from "@ogrency/core";
import type { Booking, BookingInput } from "../types/booking";

/**
 * IBookingService - Booking Service Interface
 * 
 * Defines the contract for booking operations.
 * Implementations must provide all methods defined here.
 */
export interface IBookingService {
  /**
   * Get a single booking by ID
   */
  getBooking(id: string | number): Promise<Result<Booking>>;

  /**
   * Get bookings by guest ID
   */
  getBookingsByGuestId(guestId: string | number): Promise<Result<Booking[]>>;

  /**
   * Get booked dates for a cabin (for date picker)
   */
  getBookedDates(cabinId: string | number, today: string): Promise<Result<unknown[]>>;

  /**
   * Create a booking (returns full booking with ID)
   */
  createBooking(input: BookingInput): Promise<Result<Booking>>;

  /**
   * Create a booking (basic insert, no return)
   */
  createBookingBasic(input: BookingInput): Promise<Result<void>>;

  /**
   * Update a booking
   */
  updateBooking(id: string | number, input: Partial<BookingInput>): Promise<Result<Booking>>;

  /**
   * Delete a booking
   */
  deleteBooking(id: string | number): Promise<Result<void>>;
}


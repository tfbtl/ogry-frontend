import type { IBookingService } from "../../../lib/shared/interfaces/IBookingService";
import type { Result } from "@ogrency/core";
import type { Booking, BookingInput } from "../../../lib/shared/types/booking";

/**
 * UpdateBookingUseCase - Business logic for updating a booking
 * 
 * This use case is the ONLY entry point for UI to update bookings.
 * UI should never call IBookingService directly.
 */
export class UpdateBookingUseCase {
  constructor(private readonly bookingService: IBookingService) {}

  /**
   * Execute the use case
   * @param id - Booking identifier
   * @param input - Booking update data (Write Model - IDs only)
   * @returns Promise resolving to Result containing updated booking (Read Model) or error
   */
  async execute(id: string | number, input: BookingInput): Promise<Result<Booking>> {
    return await this.bookingService.updateBooking(id, input);
  }
}


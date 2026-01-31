import type { IBookingService } from "../../../shared/interfaces/IBookingService";
import type { Result } from "../../../shared/types/foundation";

/**
 * DeleteBookingUseCase - Business logic for deleting a booking
 * 
 * This use case is the ONLY entry point for UI to delete bookings.
 * UI should never call IBookingService directly.
 */
export class DeleteBookingUseCase {
  constructor(private readonly bookingService: IBookingService) {}

  /**
   * Execute the use case
   * @param id - Booking identifier
   * @returns Promise resolving to Result<void> or error
   */
  async execute(id: string | number): Promise<Result<void>> {
    return await this.bookingService.deleteBooking(id);
  }
}


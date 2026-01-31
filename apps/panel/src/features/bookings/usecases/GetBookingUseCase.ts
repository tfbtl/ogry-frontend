import type { IBookingService } from "../../../shared/interfaces/IBookingService";
import type { Result } from "../../../shared/types/foundation";
import type { Booking } from "../../../shared/types/booking";

/**
 * GetBookingUseCase - Business logic for retrieving a single booking
 * 
 * This use case is the ONLY entry point for UI to get a booking by ID.
 * UI should never call IBookingService directly.
 */
export class GetBookingUseCase {
  constructor(private readonly bookingService: IBookingService) {}

  /**
   * Execute the use case
   * @param id - Booking identifier
   * @returns Promise resolving to Result containing booking or error
   */
  async execute(id: string | number): Promise<Result<Booking>> {
    return await this.bookingService.getBooking(id);
  }
}


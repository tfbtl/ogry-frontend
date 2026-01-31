import type { IBookingService } from "../../../shared/interfaces/IBookingService";
import type { Result } from "../../../shared/types/foundation";
import type { Booking } from "../../../shared/types/booking";

/**
 * GetBookingsUseCase - Business logic for retrieving all bookings
 * 
 * This use case is the ONLY entry point for UI to get bookings list.
 * UI should never call IBookingService directly.
 */
export class GetBookingsUseCase {
  constructor(private readonly bookingService: IBookingService) {}

  /**
   * Execute the use case
   * @param options - Query options (filter, sort, pagination)
   * @returns Promise resolving to Result containing array of bookings
   */
  async execute(options?: {
    filter?: { field: string; value: unknown; method?: string };
    sortBy?: { field: string; direction: "asc" | "desc" };
    page?: number;
  }): Promise<Result<Booking[]>> {
    return await this.bookingService.getBookings(options);
  }
}


import { BookingServiceAdapter } from "../../services/data/supabaseAdapter/BookingServiceAdapter";
import { GetBookingsUseCase } from "../../features/bookings/usecases/GetBookingsUseCase";
import { GetBookingUseCase } from "../../features/bookings/usecases/GetBookingUseCase";
import { UpdateBookingUseCase } from "../../features/bookings/usecases/UpdateBookingUseCase";
import { DeleteBookingUseCase } from "../../features/bookings/usecases/DeleteBookingUseCase";

/**
 * Composition Root for Booking UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 */
const bookingService = new BookingServiceAdapter();

export const getBookingsUseCase = new GetBookingsUseCase(bookingService);
export const getBookingUseCase = new GetBookingUseCase(bookingService);
export const updateBookingUseCase = new UpdateBookingUseCase(bookingService);
export const deleteBookingUseCase = new DeleteBookingUseCase(bookingService);


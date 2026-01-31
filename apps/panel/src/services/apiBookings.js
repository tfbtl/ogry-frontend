import {
  getBookingsAfterDate as getBookingsAfterDateAdapter,
  getStaysAfterDate as getStaysAfterDateAdapter,
  getStaysTodayActivity as getStaysTodayActivityAdapter,
} from "./data/su\u0070abaseAdapter/bookings";
import { getBookingsUseCase, getBookingUseCase, updateBookingUseCase, deleteBookingUseCase } from "../shared/composition/bookingUseCases";

export async function getBookings({ filter, sortBy, page }) {
  const result = await getBookingsUseCase.execute({ filter, sortBy, page });
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  // Return in legacy format: { data, count }
  // Note: count is not available from UseCase, using data.length as fallback
  return { data: result.data, count: result.data.length };
}

export async function getBooking(id) {
  const result = await getBookingUseCase.execute(id);
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  return result.data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  return getBookingsAfterDateAdapter(date);
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  return getStaysAfterDateAdapter(date);
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  return getStaysTodayActivityAdapter();
}

export async function updateBooking(id, obj) {
  const result = await updateBookingUseCase.execute(id, obj);
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  return result.data;
}

export async function deleteBooking(id) {
  const result = await deleteBookingUseCase.execute(id);
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  return undefined;
}

import { getBookingsUseCase, getBookingUseCase, updateBookingUseCase, deleteBookingUseCase } from "../shared/composition/bookingUseCases";
import { supabase } from "./data/supabaseAdapter/supabaseClient";
import { getToday } from "../utils/helpers";

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
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  if (error) {
    throw new Error("Bookings could not get loaded");
  }
  return data;
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

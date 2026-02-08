import { eachDayOfInterval } from "date-fns";
import { notFound } from "next/navigation";
import { HttpClient } from "@ogrency/http";
import { BookingServiceAdapter } from "./data/supabaseAdapter/BookingServiceAdapter";
import { UserServiceAdapter } from "./data/supabaseAdapter/UserServiceAdapter";
import { CabinServiceAdapter } from "./data/supabaseAdapter/CabinServiceAdapter";
import { SettingsServiceAdapter } from "./data/supabaseAdapter/SettingsServiceAdapter";
import { ensureArrayData } from "./shared/utils/arrayHelpers";

// Initialize adapters
const bookingAdapter = new BookingServiceAdapter();
const userAdapter = new UserServiceAdapter();
const cabinAdapter = new CabinServiceAdapter();
const settingsAdapter = new SettingsServiceAdapter();

/////////////
// GET

export async function getCabin(id) {
  const { getCabinUseCase } = await import("./shared/composition/cabinUseCases");
  const result = await getCabinUseCase.execute(id);

  if (!result.ok) {
    if (result.error.httpStatus === 404) {
      notFound();
    }
    throw new Error(result.error.messageKey);
  }

  return result.data;
}

export async function getCabinPrice(id) {
  const result = await cabinAdapter.getCabinPrice(id);

  if (!result.ok) {
    return null;
  }

  return result.data;
}

export const getCabins = async function () {
  const { getCabinsUseCase } = await import("./shared/composition/cabinUseCases");
  const result = await getCabinsUseCase.execute();

  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }

  return result.data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const result = await userAdapter.getGuestByEmail(email);

  if (!result.ok) {
    // No error here! We handle the possibility of no guest in the sign in callback
    return null;
  }

  return result.data;
}

export async function getBooking(id) {
  const result = await bookingAdapter.getBooking(id);

  if (!result.ok) {
    throw new Error("Booking could not get loaded");
  }

  return result.data;
}

export async function getBookings(guestId) {
  const result = await bookingAdapter.getBookingsByGuestId(guestId);

  if (!result.ok) {
    throw new Error("Bookings could not get loaded");
  }

  return ensureArrayData(result.data, "Bookings could not get loaded");
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const result = await bookingAdapter.getBookedDates(cabinId, today);

  if (!result.ok) {
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = ensureArrayData(result.data, "Bookings could not get loaded")
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { getSettingsUseCase } = await import("./shared/composition/settingsUseCases");
  const result = await getSettingsUseCase.execute();

  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }

  // Return Settings object directly (SINGLETON, not array)
  return result.data;
}

export async function getCountries() {
  try {
    const http = new HttpClient({ baseURL: "https://restcountries.com" });
    const result = await http.get("/v2/all?fields=name,flag");
    if (!result.ok) throw new Error("Could not fetch countries");
    return result.data;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const result = await userAdapter.createGuest(newGuest);

  if (!result.ok) {
    throw new Error("Guest could not be created");
  }

  return result.data;
}

export async function createBooking(newBooking) {
  const result = await bookingAdapter.createBooking(newBooking);

  if (!result.ok) {
    throw new Error("Booking could not be created");
  }

  return result.data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const result = await userAdapter.updateGuest(id, updatedFields);

  if (!result.ok) {
    throw new Error("Guest could not be updated");
  }
  return result.data;
}

export async function updateBooking(id, updatedFields) {
  const result = await bookingAdapter.updateBooking(id, updatedFields);

  if (!result.ok) {
    throw new Error("Booking could not be updated");
  }
  return result.data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const result = await bookingAdapter.deleteBooking(id);

  if (!result.ok) {
    throw new Error("Booking could not be deleted");
  }
  return undefined;
}

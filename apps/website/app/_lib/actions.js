"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { redirect } from "next/navigation";
import { getBookings } from "./data-service";
import {
  updateGuest as updateGuestAdapter,
  insertBookingBasic as insertBookingAdapter,
  deleteBooking as deleteBookingAdapter,
  updateBooking as updateBookingAdapter,
} from "./data/su\u0070abaseAdapter";
import { emitAuthEvent } from "./auth/authEvents";

export async function updateGuestAction(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const nationalityIdRegex = /^[A-Za-z0-9]{6,12}$/;

  if (!nationalityIdRegex.test(nationalID)) {
    throw new Error("Please provide a valid national ID");
  }

  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await updateGuestAdapter(session.user.guestId, updateData);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
  //redirect("/account/profile");
}

export async function createBookingAction(bookingData, formData) {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const newBooking = {
      ...bookingData,
      guestId: session.user.guestId,
      numGuests: Number(formData.get("numGuests")),
      observations: formData.get("observations").slice(0,1000),
      extrasPrice:0,
      totalPrice: bookingData.cabinPrice,
      isPaid: false,
      hasBreakfast: false,
      status: "unconfirmed"
    }

    const { error } = await insertBookingAdapter(newBooking);
  
    if (error) {
      throw new Error("Booking could not be created");
    }

    revalidatePath(`/cabins/${bookingData.cabinId}`);

    redirect("/cabins/thankyou");
}

export async function deleteBookingAction(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await deleteBookingAdapter(bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBookingAction(formData) {
  const bookingId = Number(formData.get("bookingId"));

  //1-Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //2-Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  //3-Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  //4-Mutation
  const { error } = await updateBookingAdapter(bookingId, updateData);

  //5-Error handling
  if (error) {
    throw new Error("Booking could not be updated");
  }

  //6-ReValidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  //7-Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
  emitAuthEvent({ type: "LoggedOut" });
}

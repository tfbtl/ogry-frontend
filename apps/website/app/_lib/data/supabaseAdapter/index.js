import { supabase } from "../../supabase";

const ensureArray = (value, errorMessage) => {
  if (!Array.isArray(value)) throw new Error(errorMessage);
  return value;
};

export const fetchCabin = async (id) =>
  supabase.from("cabins").select("*").eq("id", id).single();

export const fetchCabinPrice = async (id) =>
  supabase.from("cabins").select("regularPrice, discount").eq("id", id).single();

export const fetchCabins = async () =>
  supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

export const fetchGuest = async (email) =>
  supabase.from("guests").select("*").eq("email", email).single();

export const fetchBooking = async (id) =>
  supabase.from("bookings").select("*").eq("id", id).single();

export const fetchBookings = async (guestId) =>
  supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

export const fetchBookedDates = async (cabinId, today) =>
  supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

export const fetchSettings = async () =>
  supabase.from("settings").select("*").single();

export const insertGuest = async (payload) =>
  supabase.from("guests").insert([payload]);

export const insertBooking = async (payload) =>
  supabase.from("bookings").insert([payload]).select().single();

export const insertBookingBasic = async (payload) =>
  supabase.from("bookings").insert([payload]);

export const updateGuest = async (id, payload) =>
  supabase.from("guests").update(payload).eq("id", id).select().single();

export const updateBooking = async (id, payload) =>
  supabase.from("bookings").update(payload).eq("id", id).select().single();

export const deleteBooking = async (id) =>
  supabase.from("bookings").delete().eq("id", id);

export const ensureArrayData = (data, errorMessage) =>
  ensureArray(data, errorMessage);


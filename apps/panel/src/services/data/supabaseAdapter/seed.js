import { supabase } from "./supabaseClient";

const ensureArray = (value, errorMessage) => {
  if (!Array.isArray(value)) {
    throw new Error(errorMessage);
  }
  return value;
};

export const deleteGuests = async () =>
  supabase.from("guests").delete().gt("id", 0);

export const deleteCabins = async () =>
  supabase.from("cabins").delete().gt("id", 0);

export const deleteBookings = async () =>
  supabase.from("bookings").delete().gt("id", 0);

export const createGuests = async (payload) =>
  supabase.from("guests").insert(payload);

export const createCabins = async (payload) =>
  supabase.from("cabins").insert(payload);

export const fetchGuestIds = async () => {
  const result = await supabase.from("guests").select("id").order("id");
  const rows = ensureArray(result.data, "Guest IDs could not be loaded");
  return { ...result, data: rows };
};

export const fetchCabinIds = async () => {
  const result = await supabase.from("cabins").select("id").order("id");
  const rows = ensureArray(result.data, "Cabin IDs could not be loaded");
  return { ...result, data: rows };
};

export const createBookings = async (payload) =>
  supabase.from("bookings").insert(payload);


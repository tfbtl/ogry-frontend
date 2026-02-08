/**
 * Seed Data Utility (Dev Tools)
 * 
 * Development-only utility for seeding the database with sample data.
 * This file is NOT used in production builds.
 * 
 * Migration: Moved from apps/panel/src/services/data/supabaseAdapter/seed.js
 * - Converted to TypeScript
 * - Uses composition root supabasePublicClient
 * - Removed unicode escapes
 */

import { supabasePublicClient } from "../composition/supabasePublicClient";

const ensureArray = (value: unknown, errorMessage: string): unknown[] => {
  if (!Array.isArray(value)) {
    throw new Error(errorMessage);
  }
  return value;
};

export const deleteGuests = async () =>
  supabasePublicClient.from("guests").delete().gt("id", 0);

export const deleteCabins = async () =>
  supabasePublicClient.from("cabins").delete().gt("id", 0);

export const deleteBookings = async () =>
  supabasePublicClient.from("bookings").delete().gt("id", 0);

export const createGuests = async (payload: unknown[]) =>
  supabasePublicClient.from("guests").insert(payload);

export const createCabins = async (payload: unknown[]) =>
  supabasePublicClient.from("cabins").insert(payload);

export const fetchGuestIds = async () => {
  const result = await supabasePublicClient.from("guests").select("id").order("id");
  const rows = ensureArray(result.data, "Guest IDs could not be loaded");
  return { ...result, data: rows };
};

export const fetchCabinIds = async () => {
  const result = await supabasePublicClient.from("cabins").select("id").order("id");
  const rows = ensureArray(result.data, "Cabin IDs could not be loaded");
  return { ...result, data: rows };
};

export const createBookings = async (payload: unknown[]) =>
  supabasePublicClient.from("bookings").insert(payload);


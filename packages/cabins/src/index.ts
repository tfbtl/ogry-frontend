/**
 * @ogrency/cabins - Domain Contract Package
 * 
 * Platform-agnostic cabin domain types and contracts.
 * 
 * Rules:
 * - NO UI (React components, CSS, hooks)
 * - NO Infrastructure (axios, supabase, fetch imports)
 * - NO Environment access (process.env, import.meta.env, window, document)
 * - Platform-agnostic (Node + Browser + React Native compatible)
 * - Sealed exports only (no deep imports)
 */

export type { CabinId } from "./CabinId";
export type { Cabin } from "./Cabin";
export type { CreateCabinInput } from "./CreateCabinInput";
export type { UpdateCabinInput } from "./UpdateCabinInput";
export type { CabinListQuery } from "./CabinListQuery";
export type { CabinListItem } from "./CabinListItem";
export type { CabinDetails } from "./CabinDetails";


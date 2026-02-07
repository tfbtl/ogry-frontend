import type { CabinId } from "./CabinId";

/**
 * Cabin - Domain model for cabin entity
 * 
 * This is the canonical cabin contract used across all apps.
 * Derived from existing cabin types in apps/panel and apps/website.
 * 
 * Fields:
 * - id: Unique identifier (CabinId)
 * - name: Cabin name/title
 * - maxCapacity: Maximum number of guests
 * - regularPrice: Base price per night
 * - discount: Discount amount (subtracted from regularPrice)
 * - description: Optional cabin description
 * - image: Image URL or path
 * - createdAt: Optional creation timestamp (ISO string)
 * - updatedAt: Optional last update timestamp (ISO string)
 */
export type Cabin = {
  id: CabinId;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};


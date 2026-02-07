import type { Cabin } from "./Cabin";

/**
 * CabinListItem - Lightweight cabin representation for list views
 * 
 * Contains only essential fields for list display.
 * Future: Can be extended with computed fields (e.g., finalPrice, hasDiscount).
 */
export type CabinListItem = Pick<
  Cabin,
  "id" | "name" | "maxCapacity" | "regularPrice" | "discount" | "image"
>;


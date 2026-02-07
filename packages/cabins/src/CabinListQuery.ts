/**
 * CabinListQuery - Query parameters for listing cabins
 * 
 * Optional filtering and sorting parameters.
 * Future: Add pagination (page, limit), search (name, description), etc.
 */
export type CabinListQuery = {
  /**
   * Filter by discount availability
   * - "all": All cabins
   * - "with-discount": Only cabins with discount > 0
   * - "no-discount": Only cabins with discount = 0
   */
  discount?: "all" | "with-discount" | "no-discount";
  
  /**
   * Sort field and direction
   * Format: "field-direction" (e.g., "name-asc", "regularPrice-desc")
   */
  sortBy?: string;
  
  // Future: Add more query params as needed
  // page?: number;
  // limit?: number;
  // search?: string;
};


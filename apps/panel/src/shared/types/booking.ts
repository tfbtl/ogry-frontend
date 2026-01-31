/**
 * Booking Read Model (JOIN'li, nested structure)
 * 
 * This is the shape UI consumes. It includes nested cabins and guests
 * from JOIN queries. This structure MUST be preserved to maintain
 * UI compatibility.
 */
export type Booking = {
  id: string | number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  status: "unconfirmed" | "checked-in" | "checked-out";
  totalPrice: number;
  cabinPrice?: number;
  extrasPrice?: number;
  hasBreakfast?: boolean;
  observations?: string;
  isPaid?: boolean;
  // Nested objects (JOIN'li Read Model)
  cabins: {
    name: string;
    id?: string | number;
    // Additional cabin fields as needed
  };
  guests: {
    fullName: string;
    email: string;
    country?: string;
    countryFlag?: string;
    nationalID?: string;
    id?: string | number;
    // Additional guest fields as needed
  };
};

/**
 * BookingInput (Write Model - IDs only, normalized)
 * 
 * This is used for updates. Only flat fields, no nested objects.
 */
export type BookingInput = {
  status?: "unconfirmed" | "checked-in" | "checked-out";
  isPaid?: boolean;
  hasBreakfast?: boolean;
  extrasPrice?: number;
  cabinPrice?: number;
  totalPrice?: number;
  observations?: string;
};


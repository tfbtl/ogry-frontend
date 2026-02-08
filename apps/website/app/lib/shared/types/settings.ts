/**
 * Settings Read Model (SINGLETON - not a collection)
 * 
 * Settings is a SINGLETON object, NOT an array.
 * UI accesses fields directly: settings.breakfastPrice
 * NOT: settings[0].breakfastPrice
 */
export type Settings = {
  id: number;
  breakfastPrice: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  // Additional settings fields as needed
};

/**
 * UpdateSettingsInput (Write Model - Partial)
 * 
 * All fields are optional for partial update.
 * Only changed fields are sent.
 */
export type UpdateSettingsInput = {
  breakfastPrice?: number;
  minBookingLength?: number;
  maxBookingLength?: number;
  maxGuestsPerBooking?: number;
  // Additional optional fields as needed
};


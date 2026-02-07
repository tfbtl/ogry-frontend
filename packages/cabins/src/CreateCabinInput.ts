/**
 * CreateCabinInput - Input for creating a new cabin
 * 
 * All fields are required for creation.
 * Image can be either a File (for upload) or string (URL/path).
 */
export type CreateCabinInput = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string;
};


/**
 * UpdateCabinInput - Input for updating an existing cabin
 * 
 * All fields are optional (partial update).
 * Image can be either a File (for upload) or string (URL/path).
 */
export type UpdateCabinInput = {
  name?: string;
  maxCapacity?: number;
  regularPrice?: number;
  discount?: number;
  description?: string;
  image?: File | string;
};


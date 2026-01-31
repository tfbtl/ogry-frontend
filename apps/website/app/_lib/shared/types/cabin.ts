/**
 * Cabin domain model
 */
export type Cabin = {
  id: string | number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Input for creating a new cabin
 */
export type CreateCabinInput = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string;
};

/**
 * Input for updating an existing cabin
 */
export type UpdateCabinInput = {
  name?: string;
  maxCapacity?: number;
  regularPrice?: number;
  discount?: number;
  description?: string;
  image?: File | string;
};


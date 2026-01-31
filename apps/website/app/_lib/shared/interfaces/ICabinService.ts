import type { Result } from "../types/foundation";
import type { Cabin, CreateCabinInput, UpdateCabinInput } from "../types/cabin";

/**
 * ICabinService - Abstraction for cabin data operations
 * 
 * This interface defines the contract for cabin-related operations.
 * UI layer should NEVER import this interface directly.
 * Use UseCase layer instead.
 */
export interface ICabinService {
  /**
   * Retrieve all cabins
   * @returns Promise resolving to Result containing array of cabins
   */
  getCabins(): Promise<Result<Cabin[]>>;

  /**
   * Retrieve a single cabin by ID
   * @param id - Cabin identifier
   * @returns Promise resolving to Result containing cabin or error
   */
  getCabin(id: string | number): Promise<Result<Cabin>>;

  /**
   * Create a new cabin
   * @param input - Cabin creation data
   * @returns Promise resolving to Result containing created cabin or error
   */
  createCabin(input: CreateCabinInput): Promise<Result<Cabin>>;

  /**
   * Update an existing cabin
   * @param id - Cabin identifier
   * @param input - Cabin update data
   * @returns Promise resolving to Result containing updated cabin or error
   */
  updateCabin(id: string | number, input: UpdateCabinInput): Promise<Result<Cabin>>;

  /**
   * Delete a cabin by ID
   * @param id - Cabin identifier
   * @returns Promise resolving to Result<void> or error
   */
  deleteCabin(id: string | number): Promise<Result<void>>;
}


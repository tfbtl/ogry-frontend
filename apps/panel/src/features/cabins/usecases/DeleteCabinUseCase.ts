import type { ICabinService } from "../../../shared/interfaces/ICabinService";
import type { Result } from "../../../shared/types/foundation";

/**
 * DeleteCabinUseCase - Business logic for deleting a cabin
 * 
 * This use case is the ONLY entry point for UI to delete cabins.
 * UI should never call ICabinService directly.
 */
export class DeleteCabinUseCase {
  constructor(private readonly cabinService: ICabinService) {}

  /**
   * Execute the use case
   * @param id - Cabin identifier
   * @returns Promise resolving to Result<void> or error
   */
  async execute(id: string | number): Promise<Result<void>> {
    return await this.cabinService.deleteCabin(id);
  }
}


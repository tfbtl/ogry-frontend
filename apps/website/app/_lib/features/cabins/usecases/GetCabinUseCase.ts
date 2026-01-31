import type { ICabinService } from "../../shared/interfaces/ICabinService";
import type { Result } from "../../shared/types/foundation";
import type { Cabin } from "../../shared/types/cabin";

/**
 * GetCabinUseCase - Business logic for retrieving a single cabin
 * 
 * This use case is the ONLY entry point for UI to get a cabin by ID.
 * UI should never call ICabinService directly.
 */
export class GetCabinUseCase {
  constructor(private readonly cabinService: ICabinService) {}

  /**
   * Execute the use case
   * @param id - Cabin identifier
   * @returns Promise resolving to Result containing cabin or error
   */
  async execute(id: string | number): Promise<Result<Cabin>> {
    return await this.cabinService.getCabin(id);
  }
}


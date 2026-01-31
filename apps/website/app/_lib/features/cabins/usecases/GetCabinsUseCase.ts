import type { ICabinService } from "../../shared/interfaces/ICabinService";
import type { Result } from "../../shared/types/foundation";
import type { Cabin } from "../../shared/types/cabin";

/**
 * GetCabinsUseCase - Business logic for retrieving all cabins
 * 
 * This use case is the ONLY entry point for UI to get cabins list.
 * UI should never call ICabinService directly.
 */
export class GetCabinsUseCase {
  constructor(private readonly cabinService: ICabinService) {}

  /**
   * Execute the use case
   * @returns Promise resolving to Result containing array of cabins
   */
  async execute(): Promise<Result<Cabin[]>> {
    return await this.cabinService.getCabins();
  }
}


import type { ICabinService } from "../../../lib/shared/interfaces/ICabinService";
import type { Result } from "@ogrency/core";
import type { Cabin, CreateCabinInput } from "../../../lib/shared/types/cabin";

/**
 * CreateCabinUseCase - Business logic for creating a new cabin
 * 
 * This use case is the ONLY entry point for UI to create cabins.
 * UI should never call ICabinService directly.
 */
export class CreateCabinUseCase {
  constructor(private readonly cabinService: ICabinService) {}

  /**
   * Execute the use case
   * @param input - Cabin creation data
   * @returns Promise resolving to Result containing created cabin or error
   */
  async execute(input: CreateCabinInput): Promise<Result<Cabin>> {
    return await this.cabinService.createCabin(input);
  }
}


import type { ICabinService } from "../../../shared/interfaces/ICabinService";
import type { Result } from "../../../shared/types/foundation";
import type { Cabin, UpdateCabinInput } from "../../../shared/types/cabin";

/**
 * UpdateCabinUseCase - Business logic for updating an existing cabin
 * 
 * This use case is the ONLY entry point for UI to update cabins.
 * UI should never call ICabinService directly.
 */
export class UpdateCabinUseCase {
  constructor(private readonly cabinService: ICabinService) {}

  /**
   * Execute the use case
   * @param id - Cabin identifier
   * @param input - Cabin update data
   * @returns Promise resolving to Result containing updated cabin or error
   */
  async execute(id: string | number, input: UpdateCabinInput): Promise<Result<Cabin>> {
    return await this.cabinService.updateCabin(id, input);
  }
}


import type { ICabinService } from "../../shared/interfaces/ICabinService";
import type { Result } from "../../shared/types/foundation";
import type { Cabin, CreateCabinInput, UpdateCabinInput } from "../../shared/types/cabin";
import { ok, err } from "../../shared/utils/errorHelpers";
import * as apiClient from "../../api/apiClient";

/**
 * CabinDto - Backend API response shape
 * 
 * This type represents the backend API response.
 * Mapping to domain Cabin happens in this adapter (Anti-Corruption Layer).
 */
type CabinDto = {
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
 * BackendCabinServiceAdapter - Backend API implementation of ICabinService
 * 
 * This adapter implements ICabinService using the backend API.
 * It uses apiClient for HTTP requests and maps backend DTOs to domain models.
 * 
 * Rules:
 * - NO axios import (uses apiClient only)
 * - NO fetch import (uses apiClient only)
 * - NO supabase import
 * - Mapping happens inside adapter (Anti-Corruption Layer)
 */
export class BackendCabinServiceAdapter implements ICabinService {
  private readonly baseUrl: string;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
    }
    this.baseUrl = `${apiUrl}/api/v1`;
  }

  /**
   * Map CabinDto to domain Cabin
   * Anti-Corruption Layer: isolates backend shape from domain model
   */
  private mapCabinDtoToCabin(dto: CabinDto): Cabin {
    return {
      id: dto.id,
      name: dto.name,
      maxCapacity: dto.maxCapacity,
      regularPrice: dto.regularPrice,
      discount: dto.discount,
      description: dto.description,
      image: dto.image,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  async getCabins(): Promise<Result<Cabin[]>> {
    const result = await apiClient.get<CabinDto[]>(`${this.baseUrl}/cabins`);

    if (!result.ok) {
      return err(result.error);
    }

    const cabins = result.data.map((dto) => this.mapCabinDtoToCabin(dto));
    return ok(cabins);
  }

  async getCabin(id: string | number): Promise<Result<Cabin>> {
    const result = await apiClient.get<CabinDto>(`${this.baseUrl}/cabins/${id}`);

    if (!result.ok) {
      return err(result.error);
    }

    const cabin = this.mapCabinDtoToCabin(result.data);
    return ok(cabin);
  }

  /**
   * Create cabin - NOT IMPLEMENTED (read-only scope)
   */
  async createCabin(_input: CreateCabinInput): Promise<Result<Cabin>> {
    return err({
      code: "NOT_IMPLEMENTED",
      messageKey: "errors.notImplemented",
      clientTimestamp: new Date().toISOString(),
    });
  }

  /**
   * Update cabin - NOT IMPLEMENTED (read-only scope)
   */
  async updateCabin(_id: string | number, _input: UpdateCabinInput): Promise<Result<Cabin>> {
    return err({
      code: "NOT_IMPLEMENTED",
      messageKey: "errors.notImplemented",
      clientTimestamp: new Date().toISOString(),
    });
  }

  /**
   * Delete cabin - NOT IMPLEMENTED (read-only scope)
   */
  async deleteCabin(_id: string | number): Promise<Result<void>> {
    return err({
      code: "NOT_IMPLEMENTED",
      messageKey: "errors.notImplemented",
      clientTimestamp: new Date().toISOString(),
    });
  }
}


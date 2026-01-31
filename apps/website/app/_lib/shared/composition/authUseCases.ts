import { AuthServiceAdapter } from "../../data/supabaseAdapter/AuthServiceAdapter";
import { GetSessionUseCase } from "../../features/auth/usecases/GetSessionUseCase";

/**
 * Composition Root for Auth UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 * 
 * Note: Website uses NextAuth, which has a different flow.
 * Currently only GetSessionUseCase is implemented.
 */
const authService = new AuthServiceAdapter();

export const getSessionUseCase = new GetSessionUseCase(authService);


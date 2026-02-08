import { UserServiceAdapter } from "../../data/supabaseAdapter/UserServiceAdapter";
import { GetCurrentUserUseCase } from "../../features/users/usecases/GetCurrentUserUseCase";

/**
 * Composition Root for User UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 * 
 * Note: Website uses NextAuth, which has a different flow.
 * Currently only GetCurrentUserUseCase is implemented.
 */
const userService = new UserServiceAdapter();

export const getCurrentUserUseCase = new GetCurrentUserUseCase(userService);


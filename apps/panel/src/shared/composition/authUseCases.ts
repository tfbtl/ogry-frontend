import { AuthServiceAdapter } from "../../services/data/supabaseAdapter/AuthServiceAdapter";
import { LoginUseCase } from "../../features/authentication/usecases/LoginUseCase";
import { LogoutUseCase } from "../../features/authentication/usecases/LogoutUseCase";
import { GetSessionUseCase } from "../../features/authentication/usecases/GetSessionUseCase";

/**
 * Composition Root for Auth UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 */
const authService = new AuthServiceAdapter();

export const loginUseCase = new LoginUseCase(authService);
export const logoutUseCase = new LogoutUseCase(authService);
export const getSessionUseCase = new GetSessionUseCase(authService);


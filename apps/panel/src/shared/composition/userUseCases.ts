import { UserServiceAdapter } from "../../services/data/supabaseAdapter/UserServiceAdapter";
import { SignupUseCase } from "../../features/users/usecases/SignupUseCase";
import { GetCurrentUserUseCase } from "../../features/users/usecases/GetCurrentUserUseCase";
import { UpdateCurrentUserUseCase } from "../../features/users/usecases/UpdateCurrentUserUseCase";

/**
 * Composition Root for User UseCases
 * 
 * This module wires up UseCases with their concrete adapters.
 * UI layer should import UseCases from here, not directly.
 */
const userService = new UserServiceAdapter();

export const signupUseCase = new SignupUseCase(userService);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(userService);
export const updateCurrentUserUseCase = new UpdateCurrentUserUseCase(userService);


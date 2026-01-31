import { loginUseCase, logoutUseCase } from "../shared/composition/authUseCases";
import { signupUseCase, getCurrentUserUseCase, updateCurrentUserUseCase } from "../shared/composition/userUseCases";
import { emitAuthEvent } from "./auth/authEvents";

export async function signup({ fullName, email, password }) {
  const result = await signupUseCase.execute({ fullName, email, password });
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  // Return in legacy format: { user, session }
  // Note: Signup returns user, but no session (user needs to login)
  return {
    user: result.data,
    session: null,
  };
}

export async function login({ email, password }) {
  const result = await loginUseCase.execute({ email, password });
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  // Return in legacy format: { user, session }
  return {
    user: result.data.user,
    session: result.data.session,
  };
}

export async function getCurrentUser() {
  const result = await getCurrentUserUseCase.execute();
  if (!result.ok) {
    // If 401, throw error (will be handled by useQuery)
    if (result.error.httpStatus === 401) {
      throw new Error(result.error.messageKey);
    }
    throw new Error(result.error.messageKey);
  }
  // Return user in legacy format (null if no user)
  // Note: getCurrentUserUseCase returns UserProfile, which matches legacy format
  return result.data || null;
}

export async function logout() {
  const result = await logoutUseCase.execute();
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  emitAuthEvent({ type: "LoggedOut" });
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  const result = await updateCurrentUserUseCase.execute({ password, fullName, avatar });
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  // Return in legacy format: { user }
  return {
    user: result.data,
  };
}

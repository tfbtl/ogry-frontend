/**
 * AuthUser domain model
 */
export type AuthUser = {
  id: string;
  email: string;
  role?: string;
  user_metadata?: {
    fullName?: string;
    avatar?: string;
  };
  app_metadata?: Record<string, unknown>;
};

/**
 * AuthSession domain model
 */
export type AuthSession = {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    expires_in?: number;
    token_type: string;
  };
  user: AuthUser;
};

/**
 * Login input
 */
export type LoginInput = {
  email: string;
  password: string;
};


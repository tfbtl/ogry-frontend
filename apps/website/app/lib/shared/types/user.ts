/**
 * UserProfile Read Model (UI Consumption)
 * 
 * This is the shape UI consumes. It includes user profile data.
 * This structure MUST be preserved to maintain UI compatibility.
 * 
 * Note: This is User data, NOT Auth data.
 * Auth handles session/tokens, User handles profile/preferences.
 */
export type UserProfile = {
  id: string;
  email: string;
  role?: string;
  user_metadata?: {
    fullName?: string;
    avatar?: string;
  };
  app_metadata?: Record<string, unknown>;
  // Additional profile fields as needed
};

/**
 * SignupInput (Write Model)
 */
export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

/**
 * UpdateUserInput (Write Model - Partial)
 * 
 * Avatar can be File (for upload) or string (existing URL).
 * Adapter handles File → URL conversion.
 * UI and UseCase do NOT know about storage details.
 */
export type UpdateUserInput = {
  fullName?: string;
  avatar?: File | string; // File for upload, string for existing URL
  password?: string;
};


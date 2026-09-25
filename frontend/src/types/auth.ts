export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  isEmailVerified?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

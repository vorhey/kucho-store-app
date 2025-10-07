export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface RequestPasswordResetData {
  email: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
}

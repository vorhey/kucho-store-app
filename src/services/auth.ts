import type {
  AuthResponse,
  RequestPasswordResetData,
  ResetPasswordData,
  SignInData,
  SignUpData,
} from "@/types/auth";

const API_BASE = "/api/auth";
const USER_API_BASE = "/api/user";
const AUTH_TOKEN_KEY = "kucho_auth_token";

const isBrowser = () => typeof window !== "undefined";

export function storeAuthToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function signIn(data: SignInData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function requestPasswordReset(
  data: RequestPasswordResetData
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/request-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function resetPassword(
  data: ResetPasswordData
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function validateSession(): Promise<AuthResponse> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, message: "No active session" };
  }

  const response = await fetch(`${USER_API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export async function updateUserProfile(data): Promise<AuthResponse> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/update-profile`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getUserProfile(): Promise<AuthResponse> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, message: "No active session" };
  }

  const response = await fetch(`${USER_API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

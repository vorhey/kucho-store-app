import type {
  AuthResponse,
  RequestPasswordResetData,
  ResetPasswordData,
  SignInData,
  SignUpData,
} from "@/types/auth";

const API_BASE = "/api/auth";

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
  // const response = await fetch(`${API_BASE}/validate`, {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });
  // return response.json();
  return { success: true, message: "validated" };
}

export async function updateUserProfile(data): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/update-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

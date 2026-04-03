/**
 * Auth API Response Models (DTOs)
 */

export interface LoginResponse {
  id: string;
  email: string;
  username: string;
  token: string;
  created_at: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  token: string;
  created_at: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

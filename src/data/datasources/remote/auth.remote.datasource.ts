/**
 * Auth Remote Data Source
 * Handles API calls to backend
 */

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiErrorResponse,
} from "../models/auth.model";

const API_BASE_URL = "https://divider-backend.onrender.com";
const API_TIMEOUT = 30000; // 30 seconds

export class AuthRemoteDataSource {
  /**
   * Login with email and password
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data: RegisterResponse = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Extract error message from response
   */
  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const clonedResponse = response.clone();
      const contentType = clonedResponse.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const errorData = await clonedResponse.json();
        if (errorData.error) {
          return errorData.error;
        }
        if (errorData.message) {
          return errorData.message;
        }
      }
      
      // Fallback to text if not JSON
      const text = await clonedResponse.text();
      return text || `HTTP ${response.status}`;
    } catch (error) {
      return `HTTP ${response.status}`;
    }
  }
}

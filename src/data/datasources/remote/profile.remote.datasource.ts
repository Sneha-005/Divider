/**
 * Profile Remote Data Source
 * Handles API calls to backend for profile operations
 */

import {
  ProfileResponse,
  UpdateProfileRequest,
  ApiErrorResponse,
} from "../../models/profile.model";
import { AuthLocalDataSource } from "../local/auth.local.datasource";

const API_BASE_URL = "https://divider-backend.onrender.com"; // Update with your actual API URL
const API_TIMEOUT = 30000; // 30 seconds

export class ProfileRemoteDataSource {
  constructor(private authLocalDataSource: AuthLocalDataSource) {}

  /**
   * Fetch user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data: ProfileResponse = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    preferences: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log('📤 Sending notification preferences update:', preferences);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 API Response status:', response.status);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // Handle empty response body
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0" || response.status === 204) {
        console.log('✓ Update successful (empty response)');
        return {} as ProfileResponse;
      }

      const text = await response.text();
      if (!text) {
        console.log('✓ Update successful (no body)');
        return {} as ProfileResponse;
      }

      console.log('✓ Update successful with response data');
      const data: ProfileResponse = JSON.parse(text);
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

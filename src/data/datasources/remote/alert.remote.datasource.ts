/**
 * Alert Remote Data Source
 * Handles API calls to backend for alert operations
 */

import { AlertResponse, CreateAlertRequest, CreateAlertResponse } from "../../models/alert.model";
import { AuthLocalDataSource } from "../local/auth.local.datasource";

const API_BASE_URL = "https://divider-backend.onrender.com";
const API_TIMEOUT = 30000; // 30 seconds

export class AlertRemoteDataSource {
  constructor(private authLocalDataSource: AuthLocalDataSource) {}

  /**
   * Fetch all alerts for the current user
   */
  async getAlerts(): Promise<AlertResponse[]> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/trading/alerts`, {
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

      const data: AlertResponse[] = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Create a new price alert
   */
  async createAlert(
    symbol: string,
    price: number,
    condition: "ABOVE" | "BELOW"
  ): Promise<CreateAlertResponse> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const payload: CreateAlertRequest = {
        symbol,
        price,
        condition,
      };

      const response = await fetch(`${API_BASE_URL}/trading/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data: CreateAlertResponse = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<void> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/trading/alerts/${alertId}`, {
        method: "DELETE",
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
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Update an alert
   */
  async updateAlert(
    alertId: string,
    symbol: string,
    price: number,
    condition: "ABOVE" | "BELOW"
  ): Promise<CreateAlertResponse> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const payload = {
        symbol,
        price,
        condition,
      };

      const response = await fetch(`${API_BASE_URL}/trading/alerts/${alertId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data: CreateAlertResponse = await response.json();
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

      const text = await clonedResponse.text();
      return text || `HTTP ${response.status}`;
    } catch (error) {
      return `HTTP ${response.status}`;
    }
  }
}

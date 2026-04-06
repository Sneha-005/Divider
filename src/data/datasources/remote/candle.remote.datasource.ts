/**
 * Candle Remote Data Source
 * Handles API calls to backend for candlestick data
 */

import { CandleResponse } from "../../models/candle.model";
import { AuthLocalDataSource } from "../local/auth.local.datasource";

const API_BASE_URL = "https://divider-backend.onrender.com";
const API_TIMEOUT = 30000; // 30 seconds

export class CandleRemoteDataSource {
  constructor(private authLocalDataSource: AuthLocalDataSource) {}

  /**
   * Fetch candlestick data for a specific symbol
   */
  async getCandles(
    symbol: string,
    limit: number = 50,
    timeframe?: string
  ): Promise<CandleResponse[]> {
    try {
      const token = await this.authLocalDataSource.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const params: Record<string, string> = {
        symbol,
        limit: limit.toString(),
      };
      if (timeframe) {
        params.timeframe = timeframe;
      }
      const queryParams = new URLSearchParams(params).toString();

      const response = await fetch(
        `${API_BASE_URL}/trading/candles?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data: CandleResponse[] = await response.json();
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

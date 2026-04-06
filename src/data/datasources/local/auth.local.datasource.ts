/**
 * Auth Local Data Source
 * Handles local storage (token, user data)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../../domain/entities/user.entity";

const STORAGE_KEYS = {
  USER_TOKEN: "auth_token",
  USER_DATA: "user_data",
  TOKEN_SAVED_AT: "token_saved_at",
};

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export class AuthLocalDataSource {
  private isTokenExpired(savedAt: number): boolean {
    return Date.now() - savedAt >= TOKEN_TTL_MS;
  }

  /**
   * Save user token
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_TOKEN, token],
        [STORAGE_KEYS.TOKEN_SAVED_AT, Date.now().toString()],
      ]);
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  }

  /**
   * Get saved token
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);

      if (!token) {
        return null;
      }

      const savedAtRaw = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_SAVED_AT);

      // Backward compatibility for users who logged in before saved-at metadata existed.
      if (!savedAtRaw) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_SAVED_AT, Date.now().toString());
        return token;
      }

      const savedAt = Number(savedAtRaw);
      if (!Number.isFinite(savedAt) || this.isTokenExpired(savedAt)) {
        await this.clearAuthData();
        return null;
      }

      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Remaining token lifetime in milliseconds.
   * Returns 0 when token is missing or already expired.
   */
  async getRemainingTokenLifetimeMs(): Promise<number> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const savedAtRaw = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_SAVED_AT);

      if (!token || !savedAtRaw) {
        return 0;
      }

      const savedAt = Number(savedAtRaw);
      if (!Number.isFinite(savedAt)) {
        return 0;
      }

      return Math.max(0, TOKEN_TTL_MS - (Date.now() - savedAt));
    } catch (error) {
      return 0;
    }
  }

  /**
   * Remove token (logout)
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.TOKEN_SAVED_AT,
      ]);
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  }

  /**
   * Save user data
   */
  async saveUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  }

  /**
   * Get saved user data
   */
  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  /**
   * Clear all auth data (logout)
   */
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.TOKEN_SAVED_AT,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
      throw error;
    }
  }
}

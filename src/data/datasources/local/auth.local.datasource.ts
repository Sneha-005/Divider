/**
 * Auth Local Data Source
 * Handles local storage (token, user data)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@domain/entities/user.entity";

const STORAGE_KEYS = {
  USER_TOKEN: "auth_token",
  USER_DATA: "user_data",
};

export class AuthLocalDataSource {
  /**
   * Save user token
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
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
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Remove token (logout)
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
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
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
      throw error;
    }
  }
}

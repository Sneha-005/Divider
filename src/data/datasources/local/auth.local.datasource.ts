import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../../domain/entities/user.entity";

const STORAGE_KEYS = {
  USER_TOKEN: "auth_token",
  USER_DATA: "user_data",
  TOKEN_SAVED_AT: "token_saved_at",
};

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export class AuthLocalDataSource {
  
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

  async saveUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

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

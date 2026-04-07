/**
 * Profile Local Data Source
 * Handles local storage of profile data
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile } from "../../../domain/entities/profile.entity";

const STORAGE_KEYS = {
  PROFILE_DATA: "profile_data",
};

export class ProfileLocalDataSource {
  /**
   * Save profile data
   */
  async saveProfile(profile: Profile): Promise<void> {
    try {
      const profileJSON = JSON.stringify({
        id: profile.id,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        bank_account: profile.bank_account,
        bank_account_status: profile.bank_account_status,
        member_since: profile.member_since,
        is_verified: profile.is_verified,
        theme: profile.theme,
        notification_alerts: profile.notification_alerts,
        notification_trades: profile.notification_trades,
        notification_news: profile.notification_news,
        two_factor_enabled: profile.two_factor_enabled,
      });
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_DATA, profileJSON);
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  }

  /**
   * Get cached profile data
   */
  async getProfile(): Promise<Profile | null> {
    try {
      const profileJSON = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
      if (profileJSON) {
        const data = JSON.parse(profileJSON);
        return Profile.create(data);
      }
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  }

  /**
   * Clear profile data
   */
  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE_DATA);
    } catch (error) {
      console.error("Error clearing profile:", error);
      throw error;
    }
  }
}

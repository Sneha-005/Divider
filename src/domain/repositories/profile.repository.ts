/**
 * Profile Repository Interface
 * Defines contracts for profile operations
 */

import { Profile, NotificationPreferences } from "../entities/profile.entity";

export interface IProfileRepository {
  /**
   * Fetch user profile
   */
  getProfile(): Promise<Profile>;

  /**
   * Update notification preferences
   */
  updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<Profile>;
}

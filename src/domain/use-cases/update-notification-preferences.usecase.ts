/**
 * Use Case: Update Notification Preferences
 */

import { IProfileRepository } from "../repositories/profile.repository";
import { Profile, NotificationPreferences } from "../entities/profile.entity";

export class UpdateNotificationPreferencesUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(preferences: NotificationPreferences): Promise<Profile> {
    return this.profileRepository.updateNotificationPreferences(preferences);
  }
}

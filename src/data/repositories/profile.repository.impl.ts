/**
 * Profile Repository Implementation
 * Combines remote API and local storage
 */

import { IProfileRepository } from "../../domain/repositories/profile.repository";
import { Profile, NotificationPreferences } from "../../domain/entities/profile.entity";
import { ProfileRemoteDataSource } from "../datasources/remote/profile.remote.datasource";
import { ProfileLocalDataSource } from "../datasources/local/profile.local.datasource";

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(
    private remoteDataSource: ProfileRemoteDataSource,
    private localDataSource: ProfileLocalDataSource
  ) {}

  async getProfile(): Promise<Profile> {
    try {
      // Fetch from remote API
      const response = await this.remoteDataSource.getProfile();

      // Create profile entity
      const profile = Profile.create(response);

      // Cache locally
      await this.localDataSource.saveProfile(profile);

      return profile;
    } catch (error) {
      // If remote fails, try to get from local cache
      const cachedProfile = await this.localDataSource.getProfile();
      if (cachedProfile) {
        return cachedProfile;
      }
      throw error;
    }
  }

  async updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<Profile> {
    try {
      // Call remote API
      const response = await this.remoteDataSource.updateNotificationPreferences(
        preferences
      );

      // If API returns empty response, fetch fresh profile data
      if (!response || Object.keys(response).length === 0) {
        // Fetch updated profile from remote
        const freshProfile = await this.remoteDataSource.getProfile();
        const profile = Profile.create(freshProfile);
        await this.localDataSource.saveProfile(profile);
        return profile;
      }

      // Create profile entity from response
      const profile = Profile.create(response);

      // Update local cache
      await this.localDataSource.saveProfile(profile);

      return profile;
    } catch (error) {
      throw error;
    }
  }
}

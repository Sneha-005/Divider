/**
 * useProfile Hook
 * Custom hook for profile data fetching and updates
 * Implements dependency injection and use case pattern
 */

import { useState, useCallback } from 'react';
import { Profile, NotificationPreferences } from '../../domain/entities/profile.entity';
import { ProfileRepositoryImpl } from '../../data/repositories/profile.repository.impl';
import { ProfileRemoteDataSource } from '../../data/datasources/remote/profile.remote.datasource';
import { ProfileLocalDataSource } from '../../data/datasources/local/profile.local.datasource';
import { AuthLocalDataSource } from '../../data/datasources/local/auth.local.datasource';
import { GetProfileUseCase } from '../../domain/use-cases/get-profile.usecase';
import { UpdateNotificationPreferencesUseCase } from '../../domain/use-cases/update-notification-preferences.usecase';

// ============================================================================
// Dependencies
// ============================================================================

const authLocalDataSource = new AuthLocalDataSource();
const remoteDataSource = new ProfileRemoteDataSource(authLocalDataSource);
const localDataSource = new ProfileLocalDataSource();
const repository = new ProfileRepositoryImpl(remoteDataSource, localDataSource);
const getProfileUseCase = new GetProfileUseCase(repository);
const updateNotificationPreferencesUseCase =
  new UpdateNotificationPreferencesUseCase(repository);

// ============================================================================
// Hook
// ============================================================================

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updatingNotifications: boolean;
  loadProfile: () => Promise<void>;
  updateNotificationPreference: (
    key: keyof Profile,
    value: boolean
  ) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingNotifications, setUpdatingNotifications] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setError(null);
      const profile = await getProfileUseCase.execute();
      setProfile(profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Load profile error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNotificationPreference = useCallback(
    async (key: keyof Profile, value: boolean) => {
      if (!profile) return;

      setUpdatingNotifications(true);
      try {
        const preferences: NotificationPreferences = {
          [key]: value,
        };

        const updatedProfile = await updateNotificationPreferencesUseCase.execute(
          preferences
        );
        setProfile(updatedProfile);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Update failed';
        throw new Error(errorMessage);
      } finally {
        setUpdatingNotifications(false);
      }
    },
    [profile]
  );

  return {
    profile,
    loading,
    error,
    updatingNotifications,
    loadProfile,
    updateNotificationPreference,
  };
};

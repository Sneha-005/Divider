import { useState, useCallback } from 'react';
import { AuthRemoteDataSource } from '../../data/datasources/remote/auth.remote.datasource';
import { AuthLocalDataSource } from '../../data/datasources/local/auth.local.datasource';

export interface User {
  id: string;
  email: string;
  username?: string;
  token?: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  username: string;
  password: string;
}

const authDataSource = new AuthRemoteDataSource();
const localDataSource = new AuthLocalDataSource();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async ({ email, password }: LoginParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authDataSource.login({ email, password });

      if (!response.token) {
        throw new Error('Login response missing token');
      }

      const userData: User = {
        id: response.id,
        email: response.email,
        username: response.username || response.email?.split('@')[0],
        token: response.token,
      };

      await localDataSource.saveToken(response.token);
      await localDataSource.saveUserData(userData);

      setUser(userData);
      return { success: true };
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Login failed';
      let friendlyError = errorMessage;
      
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        friendlyError = 'Connection timeout. Please check your internet connection and try again.';
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        friendlyError = 'Network error. Please check your internet connection.';
      } else if (errorMessage.includes('500')) {
        friendlyError = 'Server error. Please try again later.';
      }
      
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ email, username, password }: SignupParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authDataSource.register({ email, username, password });

      if (!response.token) {
        throw new Error('Signup response missing token');
      }

      const userData: User = {
        id: response.id,
        email: response.email,
        username: response.username || username || response.email?.split('@')[0],
        token: response.token,
      };

      await localDataSource.saveToken(response.token);
      await localDataSource.saveUserData(userData);

      setUser(userData);
      return { success: true };
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Signup failed';
      let friendlyError = errorMessage;
      
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        friendlyError = 'Connection timeout. Please check your internet connection and try again.';
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        friendlyError = 'Network error. Please check your internet connection.';
      } else if (errorMessage.includes('500')) {
        friendlyError = 'Server error. Please try again later.';
      }
      
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await localDataSource.clearAuthData();
      setUser(null);
      setError(null);
    } catch (err) {
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
};

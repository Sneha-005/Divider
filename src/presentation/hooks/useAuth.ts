import { useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  username?: string;
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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async ({ email, password }: LoginParams) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call with 2 second delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock authentication - accept any valid email/password
      if (email && password) {
        setUser({
          id: '1',
          email,
        });
        return { success: true };
      } else {
        setError('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ email, username, password }: SignupParams) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call with 2 second delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (email && username && password) {
        setUser({
          id: '1',
          email,
          username,
        });
        return { success: true };
      } else {
        setError('Registration failed');
        return { success: false, error: 'Registration failed' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
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

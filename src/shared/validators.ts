export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): boolean => {
    // Min 8 chars, uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  username: (username: string): boolean => {
    // 3-20 chars, alphanumeric + underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },
};

export const getPasswordErrorMessage = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain lowercase letters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain uppercase letters';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain numbers';
  }
  if (!/[@$!%*?&]/.test(password)) {
    return 'Password must contain special characters (@$!%*?&)';
  }
  return null;
};

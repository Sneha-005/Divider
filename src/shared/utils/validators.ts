<<<<<<< HEAD
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
=======
/**
 * Validation Utilities
 * Email, Password, and Username validation with regex
 */

export const ValidationPatterns = {
  // Email validation - RFC 5322 simplified
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Password validation:
  // - At least 8 characters
  // - At least one uppercase
  // - At least one lowercase
  // - At least one number
  // - At least one special character (!@#$%^&*)
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Username validation:
  // - 3-20 characters
  // - Only letters, numbers, underscores
  username: /^[a-zA-Z0-9_]{3,20}$/,
  
  // Strong password (simpler than above)
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const Validators = {
  /**
   * Validate email format
   */
  validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: "Email is required" };
    }
    
    if (!ValidationPatterns.email.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }
    
    return { isValid: true };
  },

  /**
   * Validate password strength
   */
  validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
      return { isValid: false, error: "Password is required" };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: "Password must be at least 8 characters" };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: "Password must contain uppercase letter" };
    }
    
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: "Password must contain lowercase letter" };
    }
    
    if (!/\d/.test(password)) {
      return { isValid: false, error: "Password must contain a number" };
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      return { isValid: false, error: "Password must contain special character (!@#$%^&*)" };
    }
    
    return { isValid: true };
  },

  /**
   * Validate username format
   */
  validateUsername(username: string): ValidationResult {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: "Username is required" };
    }
    
    if (username.length < 3) {
      return { isValid: false, error: "Username must be at least 3 characters" };
    }
    
    if (username.length > 20) {
      return { isValid: false, error: "Username must be less than 20 characters" };
    }
    
    if (!ValidationPatterns.username.test(username)) {
      return { isValid: false, error: "Username can only contain letters, numbers, and underscores" };
    }
    
    return { isValid: true };
  },

  /**
   * Validate password confirmation
   */
  validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return { isValid: false, error: "Passwords do not match" };
    }
    return { isValid: true };
  },
>>>>>>> main
};

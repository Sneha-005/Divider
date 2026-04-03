import { User, AuthCredentials, SignupCredentials } from '../../domain/entities/User';
import { AuthResult } from '../../domain/repositories/AuthRepository';

export class AuthLocalDataSource {
  private currentUser: User | null = null;

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (credentials.email && credentials.password) {
      this.currentUser = {
        id: '1',
        email: credentials.email,
      };
      return { success: true, user: this.currentUser };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (credentials.email && credentials.username && credentials.password) {
      this.currentUser = {
        id: '1',
        email: credentials.email,
        username: credentials.username,
      };
      return { success: true, user: this.currentUser };
    }
    return { success: false, error: 'Registration failed' };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }
}

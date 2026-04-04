import { User, AuthCredentials, SignupCredentials } from '../entities/User';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResult>;
  signup(credentials: SignupCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
}

/**
 * Auth Repository Interface
 * Defines contracts for authentication operations
 */

import { User, AuthCredentials, RegisterData } from "@domain/entities/user.entity";

export interface IAuthRepository {
  login(credentials: AuthCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

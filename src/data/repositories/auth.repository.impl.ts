/**
 * Auth Repository Implementation
 * Combines remote API and local storage
 */

import { IAuthRepository } from "@domain/repositories/auth.repository";
import { AuthCredentials, RegisterData, User } from "@domain/entities/user.entity";
import { AuthRemoteDataSource } from "@data/datasources/remote/auth.remote.datasource";
import { AuthLocalDataSource } from "@data/datasources/local/auth.local.datasource";
import { LoginRequest, RegisterRequest } from "@data/models/auth.model";

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private remoteDataSource: AuthRemoteDataSource,
    private localDataSource: AuthLocalDataSource
  ) {}

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      // Call remote API
      const request: LoginRequest = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await this.remoteDataSource.login(request);

      // Create user entity
      const user = new User(response.id, response.email, response.username);

      // Save token and user data locally
      await this.localDataSource.saveToken(response.token);
      await this.localDataSource.saveUserData(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      // Call remote API
      const request: RegisterRequest = {
        email: data.email,
        password: data.password,
        username: data.username,
      };

      const response = await this.remoteDataSource.register(request);

      // Create user entity
      const user = new User(response.id, response.email, response.username);

      // Save token and user data locally
      await this.localDataSource.saveToken(response.token);
      await this.localDataSource.saveUserData(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.localDataSource.clearAuthData();
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.localDataSource.getUserData();
    } catch (error) {
      return null;
    }
  }
}

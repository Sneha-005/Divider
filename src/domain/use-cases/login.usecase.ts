/**
 * Login Use Case
 * Business logic for user login
 */

import { AuthCredentials, User } from "@domain/entities/user.entity";
import { IAuthRepository } from "@domain/repositories/auth.repository";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    return this.authRepository.login(credentials);
  }
}

import { RegisterData, User } from "@domain/entities/user.entity";
import { IAuthRepository } from "@domain/repositories/auth.repository";

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<User> {
    if (!data.email || !data.password || !data.username) {
      throw new Error("Email, password, and username are required");
    }

    return this.authRepository.register(data);
  }
}

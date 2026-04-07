/**
 * Use Case: Get User Profile
 */

import { IProfileRepository } from "../repositories/profile.repository";
import { Profile } from "../entities/profile.entity";

export class GetProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(): Promise<Profile> {
    return this.profileRepository.getProfile();
  }
}

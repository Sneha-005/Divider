import { AuthCredentials, SignupCredentials } from '../../domain/entities/User';
import { AuthRepository, AuthResult } from '../../domain/repositories/AuthRepository';
import { AuthLocalDataSource } from '../datasources/AuthLocalDataSource';

export class AuthRepositoryImpl implements AuthRepository {
  private dataSource: AuthLocalDataSource;

  constructor(dataSource: AuthLocalDataSource) {
    this.dataSource = dataSource;
  }

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    return this.dataSource.login(credentials);
  }

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    return this.dataSource.signup(credentials);
  }

  async logout(): Promise<void> {
    return this.dataSource.logout();
  }
}

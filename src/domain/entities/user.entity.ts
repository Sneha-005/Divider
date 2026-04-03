/**
 * User Entity - Business logic model
 */

export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly username?: string,
    readonly createdAt?: Date
  ) {}

  static create(email: string, username?: string, id: string = "temp"): User {
    return new User(id, email, username, new Date());
  }
}

export class AuthCredentials {
  constructor(
    readonly email: string,
    readonly password: string
  ) {}
}

export class RegisterData {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly username: string
  ) {}
}

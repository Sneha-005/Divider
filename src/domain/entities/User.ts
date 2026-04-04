export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  username: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
  BASIC_USER = 'BASIC_USER'
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  user: User;
  expiresAt: Date;
  createdAt: Date;
}
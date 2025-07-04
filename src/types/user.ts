import { RowDataPacket } from "mysql2";
import { Pagination } from "./types.js";

export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user",
}
export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: USER_ROLE;
  created_at: string;
}

export type NewUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: USER_ROLE;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: USER_ROLE;
};

export type LoginData = {
  email: string;
  password: string;
};

export interface CountResult extends RowDataPacket {
  count: number;
}

export interface GetAllUsersOptions {
  filters: {
    name?: string;
    email?: string;
  };
  pagination: Pagination;
}

export interface UsersCountQueryResult extends RowDataPacket {
  totalItems: number;
}

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  role?: USER_ROLE;
};

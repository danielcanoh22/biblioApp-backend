import { RowDataPacket } from "mysql2";
import { string } from "zod/v4";

// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: "admin" | "user";
// };

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

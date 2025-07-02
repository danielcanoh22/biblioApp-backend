import { RowDataPacket } from "mysql2";

export interface UserQueryResult extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  created_at: string;
}

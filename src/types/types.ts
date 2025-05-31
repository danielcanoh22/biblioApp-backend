import { RowDataPacket } from "mysql2";

export interface Book extends RowDataPacket {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  total_copies: number;
  available_copies: number;
  image: string;
  created_at: string;
}

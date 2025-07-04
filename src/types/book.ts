import { RowDataPacket } from "mysql2";

export interface Book {
  id?: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  total_copies: number;
  available_copies: number;
  image: string;
  created_at?: string;
}

export interface BookIdQueryResult extends RowDataPacket {
  author_id: number;
  genre_id: number;
}

export interface BooksCountQueryResult extends RowDataPacket {
  totalItems: number;
}

export interface GetAllOptions {
  filters: { author?: string; genre?: string; title?: string };
  pagination: { limit: number; offset: number };
}

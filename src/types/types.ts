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

export interface GetAllOptions {
  filters: { author?: string; genre?: string };
  pagination: { limit: number; offset: number };
}

export interface BooksCountQueryResult extends RowDataPacket {
  totalItems: number;
}

export type AuthorResolvePayload = {
  author_id?: number | null;
  new_author_name?: string | null;
};

export type GenreResolvePayload = {
  genre_id?: number | null;
  new_genre_name?: string | null;
};

export type Pagination = {
  limit: number;
  offset: number;
};

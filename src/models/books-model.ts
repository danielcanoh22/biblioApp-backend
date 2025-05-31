import mysql, { RowDataPacket } from "mysql2/promise";
import { DB_CONFIG } from "../config/config.js";
import { Book } from "../types/types.js";

console.log(DB_CONFIG);

const connection = await mysql.createConnection(DB_CONFIG);

export class BooksModel {
  static async getAllBooks() {
    try {
      const [books] = await connection.query<Book[]>(
        `SELECT 
          book.id,
          book.title,
          book.description,
          book.total_copies,
          book.available_copies,
          book.image,
          book.created_at,
          author.name AS author,
          genre.name AS genre
        FROM book
        JOIN author ON book.author_id = author.id
        JOIN genre ON book.genre_id = genre.id;`
      );

      if (books.length === 0) return [];

      return books;
    } catch (error) {
      throw new Error("Ocurrió un error al obtener los libros");
    }
  }

  static async getBookById(id: string) {
    try {
      const [books] = await connection.query<Book[]>(
        `
        SELECT 
          book.id,
          book.title,
          book.description,
          book.total_copies,
          book.available_copies,
          book.image,
          book.created_at,
          author.name AS author,
          genre.name AS genre
        FROM book
        JOIN author ON book.author_id = author.id
        JOIN genre ON book.genre_id = genre.id
        WHERE book.id = ?;
        `,
        [id]
      );

      if (books.length === 0) return [];

      return books[0];
    } catch (error) {
      throw new Error("Ocurrió un error al obtener el libro");
    }
  }
}

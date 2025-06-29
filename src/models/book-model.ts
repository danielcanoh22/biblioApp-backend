import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DB_CONFIG } from "../config/config.js";
import { BookDbPayload, UpdateBookDbPayload } from "../schemas/book.js";
import {
  BookIdQueryResult,
  BooksCountQueryResult,
  GetAllOptions,
} from "../types/types.js";

const connection = await mysql.createConnection(DB_CONFIG);

export class BookModel {
  static async create(data: BookDbPayload) {
    const {
      title,
      author_id,
      genre_id,
      description,
      available_copies,
      total_copies,
      image,
    } = data;

    const [bookResult] = await connection.query<ResultSetHeader>(
      `
      INSERT INTO book (title, author_id, genre_id, description, total_copies, available_copies, image)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        title,
        author_id,
        genre_id,
        description,
        total_copies,
        available_copies,
        image,
      ]
    );

    const bookId = bookResult.insertId;

    const [bookRows] = await connection.query<RowDataPacket[]>(
      `
      SELECT b.id, b.title, a.name AS author, g.name AS genre, b.description, b.total_copies,
            b.available_copies, b.image, b.created_at
      FROM book b
      JOIN author a ON b.author_id = a.id
      JOIN genre g ON b.genre_id = g.id
      WHERE b.id = ?
      `,
      [bookId]
    );

    return bookRows[0];
  }

  static async getAll(options: GetAllOptions) {
    const { filters, pagination } = options;
    const { limit, offset } = pagination;

    const baseQuery = `
      FROM book
      JOIN author ON book.author_id = author.id
      JOIN genre ON book.genre_id = genre.id
    `;

    const whereClauses: string[] = [];
    const values: (string | number)[] = [];

    if (filters.author) {
      whereClauses.push("author.name LIKE ?");
      values.push(`%${filters.author}%`);
    }

    if (filters.genre) {
      whereClauses.push("genre.name LIKE ?");
      values.push(`%${filters.genre}%`);
    }

    const whereStr =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countSql = `SELECT COUNT(book.id) AS totalItems ${baseQuery} ${whereStr};`;
    const [countRows] = await connection.query<BooksCountQueryResult[]>(
      countSql,
      values
    );
    const totalItems = countRows[0].totalItems;

    const dataSql = `
      SELECT 
          book.id, book.title, book.description,
          book.total_copies, book.available_copies,
          book.image, book.created_at,
          author.name AS author, genre.name AS genre
      ${baseQuery}
      ${whereStr}
      ORDER BY book.created_at DESC
      LIMIT ? OFFSET ?;
    `;

    const [books] = await connection.query<RowDataPacket[]>(dataSql, [
      ...values,
      limit,
      offset,
    ]);

    return { books, totalItems };
  }

  static async getById(id: string) {
    const [book] = await connection.query<RowDataPacket[]>(
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

    if (book.length === 0) return undefined;

    return book[0];
  }

  static async update(id: string, newData: UpdateBookDbPayload) {
    const fieldsToUpdate = Object.keys(newData);
    if (fieldsToUpdate.length === 0) return true;

    const setClause = fieldsToUpdate
      .map((field) => `\`${field}\` = ?`)
      .join(", ");

    const values = Object.values(newData);

    const sql = `
    UPDATE book
    SET ${setClause}
    WHERE id = ?;
  `;

    const [result] = await connection.query<ResultSetHeader>(sql, [
      ...values,
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id: string) {
    await connection.beginTransaction();

    try {
      const [bookDataRows] = await connection.query<BookIdQueryResult[]>(
        `SELECT author_id, genre_id FROM book WHERE id = ?`,
        [id]
      );

      if (bookDataRows.length === 0) {
        await connection.rollback();
        return false;
      }

      const { author_id, genre_id } = bookDataRows[0];

      const [deleteResult] = await connection.query<ResultSetHeader>(
        `DELETE FROM book WHERE id = ?`,
        [id]
      );

      if (deleteResult.affectedRows === 0)
        throw new Error("No se pudo eliminar el libro");

      const [authorBooksCountRows] = await connection.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS count FROM book WHERE author_id = ?`,
        [author_id]
      );

      if (authorBooksCountRows[0].count === 0) {
        await connection.query("DELETE FROM author WHERE id = ?", [author_id]);
      }

      const [genreBooksCountRows] = await connection.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS count FROM book WHERE genre_id = ?`,
        [genre_id]
      );

      if (genreBooksCountRows[0].count === 0) {
        await connection.query("DELETE FROM genre WHERE id = ?", [genre_id]);
      }

      await connection.commit();

      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error("Ocurrió un error al eliminar el libro");
    }
  }
}

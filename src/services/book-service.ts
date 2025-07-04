import { AppError } from "../middlewares/error-handler.js";
import { AuthorModel } from "../models/author-model.js";
import { BookModel } from "../models/book-model.js";
import { GenreModel } from "../models/genre-model.js";
import { LoanModel } from "../models/loan-model.js";
import {
  CreateBookApiDTO,
  GetBooksQueryDTO,
  UpdateBookApiDTO,
  UpdateBookDbPayload,
} from "../schemas/book.js";
import { AuthorResolvePayload } from "../types/author.js";
import { GenreResolvePayload } from "../types/genre.js";

export class BookService {
  private static async _resolveAuthorId(data: AuthorResolvePayload) {
    if (data.new_author_name) {
      const authorId = await AuthorModel.getOrCreate(data.new_author_name);
      return authorId;
    }
    return Number(data.author_id);
  }

  private static async _resolveGenreId(data: GenreResolvePayload) {
    if (data.new_genre_name) {
      const genreId = await GenreModel.getOrCreate(data.new_genre_name);
      return genreId;
    }
    return Number(data.genre_id);
  }

  static async create(data: CreateBookApiDTO) {
    const [finalAuthorId, finalGenreId] = await Promise.all([
      this._resolveAuthorId(data),
      this._resolveGenreId(data),
    ]);

    const bookPayload = {
      title: data.title,
      description: data.description,
      total_copies: data.total_copies,
      available_copies: data.total_copies,
      image: data.image,
      author_id: finalAuthorId,
      genre_id: finalGenreId,
    };

    const newBook = await BookModel.create(bookPayload);

    return newBook;
  }

  static async getAll(query: GetBooksQueryDTO) {
    const { page, limit, author, genre, title } = query;
    const offset = (page - 1) * limit;

    const { books, totalItems } = await BookModel.getAll({
      filters: { author, genre, title },
      pagination: { limit, offset },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
      },
    };
  }

  static async getById(id: string) {
    const book = await BookModel.getById(id);

    if (!book) {
      throw new AppError("Libro no encontrado", 404);
    }

    return book;
  }

  static async update(id: string, data: UpdateBookApiDTO) {
    const dbPayload: UpdateBookDbPayload = {};

    if (data.title !== undefined) dbPayload.title = data.title;
    if (data.description !== undefined)
      dbPayload.description = data.description;
    if (data.image !== undefined) dbPayload.image = data.image;
    if (data.total_copies !== undefined)
      dbPayload.total_copies = data.total_copies;
    if (data.available_copies !== undefined)
      dbPayload.available_copies = data.available_copies;

    if (data.author_id || data.new_author_name) {
      dbPayload.author_id = await this._resolveAuthorId(data);
    }

    if (data.genre_id || data.new_genre_name) {
      dbPayload.genre_id = await this._resolveGenreId(data);
    }

    if (Object.keys(dbPayload).length === 0) {
      return true;
    }

    const isUpdated = await BookModel.update(id, dbPayload);

    if (!isUpdated) {
      throw new AppError("Libro no encontrado", 404);
    }

    return isUpdated;
  }

  static async delete(id: string) {
    const activeLoans = await LoanModel.findActiveLoansByBookId(id);

    if (activeLoans.length > 0) {
      throw new AppError(
        "Este libro no se puede eliminar porque tiene préstamos activos o pendientes",
        409
      );
    }

    const isDeleted = await BookModel.delete(id);

    if (!isDeleted) {
      throw new AppError("Libro no encontrado", 404);
    }

    return true;
  }
}

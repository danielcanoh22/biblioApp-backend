import { AppError } from "../middlewares/error-handler.js";
import { AuthorModel } from "../models/author-model.js";
import { BookModel } from "../models/book-model.js";
import { GenreModel } from "../models/genre-model.js";
import {
  CreateBookApiDTO,
  GetBooksQueryDTO,
  UpdateBookApiDTO,
  UpdateBookDbPayload,
} from "../schemas/book.js";

export class BookService {
  static async create(data: CreateBookApiDTO) {
    const { title, author, genre, description, total_copies, image } = data;

    const authorId = await AuthorModel.getOrCreate(author);
    const genreId = await GenreModel.getOrCreate(genre);

    const newBook = await BookModel.create({
      title,
      author_id: authorId,
      genre_id: genreId,
      description,
      available_copies: total_copies,
      total_copies,
      image,
    });

    return newBook;
  }

  static async getAll(query: GetBooksQueryDTO) {
    const { page, limit, author, genre } = query;
    const offset = (page - 1) * limit;

    const { books, totalItems } = await BookModel.getAll({
      filters: { author, genre },
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

  static async update(id: string, apiData: UpdateBookApiDTO) {
    const dbPayload: UpdateBookDbPayload = {};

    if (apiData.author) {
      const authorId = await AuthorModel.getOrCreate(apiData.author);
      dbPayload.author_id = authorId;
    }

    if (apiData.genre) {
      const genreId = await GenreModel.getOrCreate(apiData.genre);
      dbPayload.genre_id = genreId;
    }

    if (apiData.title) dbPayload.title = apiData.title;
    if (apiData.description) dbPayload.description = apiData.description;
    if (apiData.total_copies) dbPayload.total_copies = apiData.total_copies;
    if (apiData.image) dbPayload.image = apiData.image;

    const isUpdated = await BookModel.update(id, dbPayload);

    return isUpdated;
  }

  static async delete(id: string) {
    const isDeleted = await BookModel.delete(id);

    if (!isDeleted) {
      throw new AppError("Libro no encontrado", 404);
    }

    return true;
  }
}

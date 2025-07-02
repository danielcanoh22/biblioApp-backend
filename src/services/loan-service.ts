import { CreateLoanApiDTO, GetLoansQueryDTO } from "../schemas/loan.js";
import { BookModel } from "../models/book-model.js";
import { AppError } from "../middlewares/error-handler.js";
import { UserModel } from "../models/user-model.js";
import { LoanModel } from "../models/loan-model.js";
import { connection } from "../db/db.js";
import { PoolConnection } from "mysql2/promise";

const MAX_LOAN_DAYS = 15;

export class LoanService {
  static async create(data: CreateLoanApiDTO) {
    const { bookId, userEmail } = data;

    let transactionConnection: PoolConnection | undefined;

    try {
      transactionConnection = await connection.getConnection();

      await transactionConnection.beginTransaction();

      const user = await UserModel.getByEmail(userEmail, transactionConnection);

      if (!user) {
        throw new AppError(
          "El correo electrónico no corresponde a un usuario registrado",
          404
        );
      }

      const book = await BookModel.getById(bookId, transactionConnection);

      if (!book || book.available_copies < 1) {
        throw new AppError("Libro no disponible para préstamo", 409);
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + MAX_LOAN_DAYS);

      const newLoan = await LoanModel.create(
        {
          user_id: user.id,
          book_id: book.id,
          due_date: dueDate,
        },
        transactionConnection
      );

      await BookModel.decrementAvailableCopies(bookId, transactionConnection);

      await transactionConnection.commit();

      return newLoan;
    } catch (error) {
      if (transactionConnection) {
        await transactionConnection.rollback();
      }
      throw error;
    } finally {
      if (transactionConnection) {
        transactionConnection.release();
      }
    }
  }

  static async getAll(query: GetLoansQueryDTO) {
    const { page, limit, userEmail } = query;
    const offset = (page - 1) * limit;

    const { loans, totalItems } = await LoanModel.getAll({
      filters: { userEmail },
      pagination: { limit, offset },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      loans,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
      },
    };
  }
}

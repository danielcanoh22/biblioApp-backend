import {
  CreateLoanApiDTO,
  GetLoansQueryDTO,
  UpdateLoanStatusApiDTO,
} from "../schemas/loan.js";
import { BookModel } from "../models/book-model.js";
import { AppError } from "../middlewares/error-handler.js";
import { UserModel } from "../models/user-model.js";
import { LoanModel } from "../models/loan-model.js";
import { connection } from "../db/db.js";
import { PoolConnection } from "mysql2/promise";
import { LOAN_STATUS, LoanFilters } from "../types/loan.js";
import { USER_ROLE } from "../types/user.js";
import { JwtPayload } from "../types/express.js";

const MAX_LOAN_DAYS = 15;

export class LoanService {
  static async create(data: CreateLoanApiDTO) {
    const { book_id, user_email } = data;

    let transactionConnection: PoolConnection | undefined;

    try {
      transactionConnection = await connection.getConnection();

      await transactionConnection.beginTransaction();

      const user = await UserModel.getByEmail(
        user_email,
        transactionConnection
      );

      if (!user) {
        throw new AppError(
          "El correo electrónico no corresponde a un usuario registrado",
          404
        );
      }

      const book = await BookModel.getById(book_id, transactionConnection);

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

  static async getAll(user: JwtPayload, query: GetLoansQueryDTO) {
    const { page, limit, user_email, status } = query;
    const offset = (page - 1) * limit;

    const filters: LoanFilters = { status, user_email };

    const { loans, totalItems } = await LoanModel.getAll({
      filters,
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

  static async getById(id: string | number) {
    const loan = await LoanModel.getById(id);

    if (!loan) {
      throw new AppError("Libro no encontrado", 404);
    }

    return loan;
  }

  static async updateStatus(
    loanId: string | number,
    data: UpdateLoanStatusApiDTO
  ) {
    const { status, comments } = data;

    const transactionConnection: PoolConnection =
      await connection.getConnection();
    await transactionConnection.beginTransaction();

    try {
      const loan = await LoanModel.getById(loanId, transactionConnection);

      if (!loan) throw new AppError("La solicitud de préstamo no existe", 404);

      const bookId = loan.book_id;
      const book = await BookModel.getById(bookId);

      if (!book)
        throw new AppError("El libro asociado al préstamo no existe", 404);

      const payload: UpdateLoanStatusApiDTO = { status };
      if (comments) payload.comments = comments;

      switch (status) {
        case LOAN_STATUS.APPROVED:
          if (book.available_copies < 1)
            throw new AppError(
              "No hay copias disponibles para aprobar este préstamo",
              409
            );

          payload.status = LOAN_STATUS.APPROVED;
          await BookModel.decrementAvailableCopies(
            bookId,
            transactionConnection
          );
          break;
        case LOAN_STATUS.RETURNED:
          payload.status = LOAN_STATUS.RETURNED;
          await BookModel.incrementAvailableCopies(
            bookId,
            transactionConnection
          );
          break;
        case LOAN_STATUS.REFUSED:
          break;

        default:
          throw new AppError(
            "No se puede realizar la actualización del estado",
            400
          );
      }

      const isUpdated = await LoanModel.updateStatus(
        loanId,
        payload,
        transactionConnection
      );

      await transactionConnection.commit();

      return isUpdated;
    } catch (error) {
      await transactionConnection.rollback();
      throw error;
    } finally {
      transactionConnection.release();
    }
  }

  static async delete(id: string | number, user: JwtPayload) {
    const loan = await LoanModel.getById(id);
    if (!loan) {
      throw new AppError("Préstamo no encontrado", 404);
    }

    if (user.role !== USER_ROLE.ADMIN && loan.user_id !== user.id) {
      throw new AppError("No tienes permiso para cancelar este préstamo.", 403);
    }

    const isDeleted = await LoanModel.delete(id);

    if (!isDeleted) {
      throw new AppError("Solicitud de préstamo no encontrada", 404);
    }

    return true;
  }
}

import bcrypt from "bcrypt";
import { AppError } from "../middlewares/error-handler.js";
import { UserModel } from "../models/user-model.js";
import { GetUsersQueryDTO, UpdateUserApiPayload } from "../schemas/user.js";
import { JwtPayload } from "../types/express.js";
import { USER_ROLE } from "../types/user.js";
import { CRYPT_SALT_ROUNDS } from "../utils/constants.js";

export class UserService {
  static async getAll(query: GetUsersQueryDTO) {
    const { page, limit, name, email } = query;
    const offset = (page - 1) * limit;

    const { users, totalItems } = await UserModel.getAll({
      filters: { name, email },
      pagination: { limit, offset },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
      },
    };
  }

  static async getById(id: string | number) {
    const user = await UserModel.getById(id);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  }

  static async update(
    id: number,
    data: UpdateUserApiPayload,
    user: JwtPayload
  ) {
    const userToUpdate = await UserModel.getById(id);
    if (!userToUpdate) {
      throw new AppError("Usuario no encontrado para actualizar", 404);
    }

    if (data.role && data.role !== userToUpdate.role && id === user.id) {
      throw new AppError("No puedes modificar tu propio rol", 403);
    }

    if (data.email) {
      const existingUser = await UserModel.getByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError(
          "El correo electrónico ya está en uso por otro usuario",
          409
        );
      }
    }

    const payloadToSave: Partial<UpdateUserApiPayload> = { ...data };

    if (payloadToSave.password) {
      payloadToSave.password = await bcrypt.hash(
        payloadToSave.password,
        CRYPT_SALT_ROUNDS
      );
    } else {
      delete payloadToSave.password;
    }

    const isUpdated = await UserModel.update(id, payloadToSave);

    if (!isUpdated) {
      throw new AppError("Usuario no encontrado para actualizar", 404);
    }

    return true;
  }

  static async delete(id: number | string, user: JwtPayload) {
    const idToDelete = Number(id);

    if (idToDelete === user.id) {
      throw new AppError(
        "Un administrador no puede eliminar su propia cuenta",
        409
      );
    }

    const userToDelete = await UserModel.getById(id);

    if (!userToDelete) {
      throw new AppError("Usuario no encontrado", 404);
    }

    if (userToDelete.role === USER_ROLE.ADMIN) {
      const adminCount = await UserModel.countAdmins();

      if (adminCount <= 1) {
        throw new AppError(
          "No se puede eliminar al último administrador del sistema",
          409
        );
      }
    }

    const isDeleted = await UserModel.delete(id);

    return isDeleted;
  }
}

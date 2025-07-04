import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../middlewares/error-handler.js";
import { UserModel } from "../models/user-model.js";
import { LoginData, RegisterData, USER_ROLE } from "../types/user.js";
import { CRYPT_SALT_ROUNDS } from "../utils/constants.js";
import { JWT_SECRET } from "../config/config.js";
import { JwtPayload } from "../types/express.js";

export class AuthService {
  static async register(data: RegisterData) {
    const { name, email, password, role } = data;

    const existingUser = await UserModel.getByEmail(email);
    if (existingUser) {
      throw new AppError("El correo electrónico ya está en uso", 409);
    }

    const passwordHash = await bcrypt.hash(password, CRYPT_SALT_ROUNDS);

    const newUser = await UserModel.create({
      name,
      email,
      passwordHash,
      role,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    const user = await UserModel.getByEmail(email);
    if (!user) {
      throw new AppError("Las credenciales son incorrectas", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Las credenciales son incorrectas", 401);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}

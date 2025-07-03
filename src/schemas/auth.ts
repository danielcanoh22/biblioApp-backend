import { z } from "zod";
import { USER_ROLE } from "../types/user.js";

export const registerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("El correo no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.nativeEnum(USER_ROLE).default(USER_ROLE.USER),
});

export const loginSchema = z.object({
  email: z.string().email("Por favor, ingresa un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

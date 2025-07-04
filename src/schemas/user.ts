import { z } from "zod";
import { USER_ROLE } from "../types/user.js";

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").optional(),
  email: z.string().email("El formato del correo no es válido").optional(),

  password: z
    .string()
    .min(6, {
      message: "La nueva contraseña debe tener al menos 6 caracteres",
    })
    .optional()
    .or(z.literal("")),

  role: z.nativeEnum(USER_ROLE).optional(),
});

export type UpdateUserApiPayload = z.infer<typeof updateUserSchema>;
export type GetUsersQueryDTO = z.infer<typeof getUsersQuerySchema>;

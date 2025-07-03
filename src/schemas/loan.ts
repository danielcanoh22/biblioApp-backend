import { z } from "zod";
import { LOAN_STATUS } from "../types/loan.js";

export const createLoanApiSchema = z.object({
  book_id: z.coerce
    .number({
      required_error: "El libro es obligatorio.",
      invalid_type_error: "El ID del libro debe ser un número.",
    })
    .int()
    .positive("El ID del libro no es válido."),

  user_name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(2, "El nombre debe tener al menos 2 caracteres."),

  user_email: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El formato del correo no es válido."),
});

export const updateLoanStatusApiSchema = z.object({
  status: z.enum(["devuelto", "pendiente", "activo", "rechazado"], {
    required_error: "El nuevo estado es obligatorio.",
  }),
  comments: z.string().optional(),
});

// Schema para implementar la paginación y búsqueda con filtros
export const getLoansQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  user_email: z.string().email().optional(),
  status: z.nativeEnum(LOAN_STATUS).optional(),
});

export type GetLoansQueryDTO = z.infer<typeof getLoansQuerySchema>;

export type CreateLoanApiDTO = z.infer<typeof createLoanApiSchema>;
export type UpdateLoanStatusApiDTO = z.infer<typeof updateLoanStatusApiSchema>;

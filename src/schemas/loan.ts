import { z } from "zod";

export const createLoanApiSchema = z.object({
  bookId: z.coerce
    .number({
      required_error: "El libro es obligatorio.",
      invalid_type_error: "El ID del libro debe ser un número.",
    })
    .int()
    .positive("El ID del libro no es válido."),

  userName: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(2, "El nombre debe tener al menos 2 caracteres."),

  userEmail: z
    .string({ required_error: "El correo es obligatorio." })
    .email("El formato del correo no es válido."),
});

export const updateLoanStatusApiSchema = z.object({
  status: z.enum(["devuelto", "atrasado"], {
    required_error: "El nuevo estado es obligatorio.",
  }),
});

export type CreateLoanApiDTO = z.infer<typeof createLoanApiSchema>;
export type UpdateLoanStatusApiDTO = z.infer<typeof updateLoanStatusApiSchema>;

import z from "zod";

// Schema para los endpoints de crear y actualizar
const createBookApiSchema = z.object({
  title: z
    .string({
      required_error: "El título del libro es obligatorio",
      invalid_type_error: "El título del libro debe ser un string",
    })
    .min(1, { message: "El título no puede estar vacío" }),

  author: z
    .string({
      required_error: "El autor del libro es obligatorio",
      invalid_type_error: "El autor del libro debe ser un string",
    })
    .min(1, { message: "El nombre del autor no puede estar vacío" }),

  genre: z
    .string({
      required_error: "El género del libro es obligatorio",
      invalid_type_error: "El género del libro debe ser un string",
    })
    .min(1, { message: "El género no puede estar vacío" }),

  description: z
    .string({
      required_error: "La descripción del libro es obligatoria",
      invalid_type_error: "La descripción del libro debe ser un string",
    })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),

  total_copies: z
    .number({
      required_error: "El número total de copias es obligatorio",
      invalid_type_error: "El número total de copias debe ser un número",
    })
    .int({ message: "Debe ser un número entero" })
    .min(1, { message: "Debe haber al menos una copia en total" }),

  image: z
    .string({
      required_error: "La URL de la imagen es obligatoria",
      invalid_type_error: "La imagen debe ser una cadena",
    })
    .url({ message: "La imagen debe ser una URL válida" }),
});

const updateBookSchema = createBookApiSchema.partial();

export const bookDbSchema = z.object({
  title: z.string(),
  author_id: z.number(),
  genre_id: z.number(),
  description: z.string(),
  total_copies: z.number(),
  available_copies: z.number(),
  image: z.string(),
});

export const updateBookDbSchema = bookDbSchema.partial();

export type CreateBookApiDTO = z.infer<typeof createBookApiSchema>;
export type UpdateBookApiDTO = z.infer<typeof updateBookSchema>;
export type BookDbPayload = z.infer<typeof bookDbSchema>;
export type UpdateBookDbPayload = z.infer<typeof updateBookDbSchema>;

export function validateApiBook(data: unknown) {
  return createBookApiSchema.safeParse(data);
}

export function validateApiPartialBook(data: unknown) {
  return updateBookSchema.safeParse(data);
}

// Schema para implementar la paginación y búsqueda con filtros
export const getBooksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  author: z.string().optional(),
  genre: z.string().optional(),
});

export type GetBooksQueryDTO = z.infer<typeof getBooksQuerySchema>;

export function validateQueryParams(data: unknown) {
  return getBooksQuerySchema.safeParse(data);
}

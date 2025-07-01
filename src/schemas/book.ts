import z from "zod";

// Schema para los endpoints de crear y actualizar
const bookApiSchemaBase = z.object({
  title: z
    .string({ required_error: "El título es obligatorio" })
    .min(1, { message: "El título no puede estar vacío" }),

  description: z
    .string({ required_error: "La descripción es obligatoria" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),

  total_copies: z.coerce
    .number({ invalid_type_error: "Las copias totales deben ser un número" })
    .int()
    .min(1),

  available_copies: z.coerce.number().int().min(0).optional(), // Hacemos este opcional

  image: z
    .string({ required_error: "La URL de la imagen es obligatoria" })
    .url({ message: "La URL de la imagen no es válida" }),

  author_id: z.coerce.number().int().positive().optional(),
  new_author_name: z.string().min(2).optional(),

  genre_id: z.coerce.number().int().positive().optional(),
  new_genre_name: z.string().min(3).optional(),
});

export const createBookApiSchema = bookApiSchemaBase
  .refine(
    (data) => {
      return (
        (data.author_id && !data.new_author_name) ||
        (!data.author_id && data.new_author_name)
      );
    },
    {
      message:
        "Debe proporcionar un autor existente o un nombre para un nuevo autor, pero no ambos.",
      path: ["author_id"],
    }
  )
  .refine(
    (data) => {
      return (
        (data.genre_id && !data.new_genre_name) ||
        (!data.genre_id && data.new_genre_name)
      );
    },
    {
      message:
        "Debe proporcionar un género existente o un nombre para un nuevo género, pero no ambos.",
      path: ["genre_id"],
    }
  );

export const updateBookApiSchema = bookApiSchemaBase
  .partial()
  .refine(
    (data) => {
      if (!data.author_id && !data.new_author_name) return true;

      return (
        (data.author_id && !data.new_author_name) ||
        (!data.author_id && data.new_author_name)
      );
    },
    {
      message:
        "Si actualiza el autor, debe proporcionar un ID o un nombre nuevo, pero no ambos.",
      path: ["author_id"],
    }
  )
  .refine(
    (data) => {
      if (!data.genre_id && !data.new_genre_name) return true;
      return (
        (data.genre_id && !data.new_genre_name) ||
        (!data.genre_id && data.new_genre_name)
      );
    },
    {
      message:
        "Si actualiza el género, debe proporcionar un ID o un nombre nuevo, pero no ambos.",
      path: ["genre_id"],
    }
  );

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
export type UpdateBookApiDTO = z.infer<typeof updateBookApiSchema>;
export type BookDbPayload = z.infer<typeof bookDbSchema>;
export type UpdateBookDbPayload = z.infer<typeof updateBookDbSchema>;

export function validateApiBook(data: unknown) {
  return createBookApiSchema.safeParse(data);
}

export function validateApiPartialBook(data: unknown) {
  return updateBookApiSchema.safeParse(data);
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

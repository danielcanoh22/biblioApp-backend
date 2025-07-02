import cors from "cors";
import express from "express";
import { createBooksRouter } from "./routes/books-routes.js";
import { PORT } from "./config/config.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { createAuthorsRouter } from "./routes/authors-routes.js";
import { createGenresRouter } from "./routes/genres-routes.js";
import { createLoansRouter } from "./routes/loans-routes.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
// app.use(corsMiddleware());
app.use(cors());

app.use("/books", createBooksRouter());
app.use("/authors", createAuthorsRouter());
app.use("/genres", createGenresRouter());
app.use("/loans", createLoansRouter());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

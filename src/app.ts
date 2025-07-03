import cors from "cors";
import express from "express";
import { createBooksRouter } from "./routes/books-routes.js";
import { PORT } from "./config/config.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { createAuthorsRouter } from "./routes/authors-routes.js";
import { createGenresRouter } from "./routes/genres-routes.js";
import { createLoansRouter } from "./routes/loans-routes.js";
import { createAuthRouter } from "./routes/auth-routes.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
// app.use(corsMiddleware());
app.use(cors());

app.use("/auth", createAuthRouter());

app.use("/api/books", createBooksRouter());
app.use("/api/authors", createAuthorsRouter());
app.use("/api/genres", createGenresRouter());
app.use("/api/loans", createLoansRouter());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

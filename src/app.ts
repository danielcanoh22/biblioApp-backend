import cors from "cors";
import express from "express";
import { createBooksRouter } from "./routes/books-routes.js";
import { CORS_ORIGIN, PORT } from "./config/config.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { createAuthorsRouter } from "./routes/authors-routes.js";
import { createGenresRouter } from "./routes/genres-routes.js";
import { createLoansRouter } from "./routes/loans-routes.js";
import { createAuthRouter } from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import { createUsersRouter } from "./routes/users-routes.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());
// app.use(corsMiddleware());
app.use(
  cors({
    origin: CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", createAuthRouter());

app.use("/api/books", createBooksRouter());
app.use("/api/authors", createAuthorsRouter());
app.use("/api/genres", createGenresRouter());
app.use("/api/loans", createLoansRouter());
app.use("/api/users", createUsersRouter());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

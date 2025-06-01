import express from "express";
import { createBooksRouter } from "./routes/books-routes.js";
import { PORT } from "./config/config.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(corsMiddleware());

app.use("/books", createBooksRouter());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

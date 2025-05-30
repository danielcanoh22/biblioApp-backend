import dotenv from "dotenv";

dotenv.config();

export const {
  PORT = 3000,
  DB_HOST = "localhost",
  DB_SCHEMA = "",
  DB_USER = "",
  DB_PASSWORD = "",
  CORS_ORIGIN = "http://localhost:5173",
} = process.env;

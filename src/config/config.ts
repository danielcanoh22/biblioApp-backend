import dotenv from "dotenv";

dotenv.config();

export const {
  PORT = 3000,
  DB_HOST = "localhost",
  DB_SCHEMA = "",
  DB_USER = "",
  DB_PASSWORD = "",
  CORS_ORIGIN = "http://localhost:5173",

  JWT_SECRET = "",
  NODE_ENV,
} = process.env;

export const DB_CONFIG = {
  host: DB_HOST,
  port: 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
};

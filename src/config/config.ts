import dotenv from "dotenv";

dotenv.config();

const {
  PORT: portStr,
  NODE_ENV,
  CORS_ORIGIN,

  DB_HOST,
  DB_SCHEMA,
  DB_PORT: dbPortStr,
  DB_USER,
  DB_PASSWORD,

  JWT_SECRET,
  COOKIE_NAME,
} = process.env;

export const PORT = Number(portStr);
export {
  NODE_ENV,
  CORS_ORIGIN,
  DB_HOST,
  DB_SCHEMA,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  COOKIE_NAME,
};

const DB_PORT = Number(dbPortStr);

export const DB_CONFIG = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
};

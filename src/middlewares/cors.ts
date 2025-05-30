import cors from "cors";

type CorsMiddlewareOptions = {
  acceptedOrigins?: string[];
};

const ACCEPTED_ORIGINS = ["http://localhost:5173"];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (origin !== undefined && acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  });

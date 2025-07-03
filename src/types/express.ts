import { User, USER_ROLE } from "./user.js";

export interface JwtPayload {
  id: number;
  email: string;
  role: USER_ROLE;
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}

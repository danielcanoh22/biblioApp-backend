import { RowDataPacket } from "mysql2";

export interface GetAllLoansOptions {
  filters: {
    userEmail?: string;
  };
  pagination: {
    limit: number;
    offset: number;
  };
}

export interface LoansCountQueryResult extends RowDataPacket {
  totalItems: number;
}

export enum LOAN_STATUS {
  RETURNED = "devuelto",
  PENDING = "pendiente",
  REFUSED = "rechazado",
  APPROVED = "activo",
}
export interface Loan extends RowDataPacket {
  id: number;
  loan_date: string;
  due_date: string;
  status: "activo" | "devuelto" | "pendiente" | "rechazado";
  comments?: string;
  user_id?: number;
  user_name: string;
  user_email: string;
  book_id?: number;
  book_title: string;
}

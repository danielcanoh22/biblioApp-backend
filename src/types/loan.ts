import { RowDataPacket } from "mysql2";

export enum LOAN_STATUS {
  RETURNED = "devuelto",
  PENDING = "pendiente",
  REFUSED = "rechazado",
  APPROVED = "activo",
}

export type LoanData = {
  user_id: number;
  book_id: number;
  due_date: Date;
};
export interface GetAllLoansOptions {
  filters: {
    user_email?: string;
    status?: LOAN_STATUS;
  };
  pagination: {
    limit: number;
    offset: number;
  };
}

export interface LoansCountQueryResult extends RowDataPacket {
  totalItems: number;
}

export interface Loan extends RowDataPacket {
  id: number;
  loan_date: string;
  due_date: string;
  status: LOAN_STATUS;
  comments?: string;
  user_id?: number;
  user_name: string;
  user_email: string;
  book_id?: number;
  book_title: string;
}

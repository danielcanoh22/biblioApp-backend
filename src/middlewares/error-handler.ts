import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      succeeded: false,
    });
  } else {
    res.status(500).json({
      message: "Ha ocurrido un error inesperado en el servidor",
      succeeded: false,
    });
  }
}

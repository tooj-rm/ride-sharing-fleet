import { DomainException } from '~/domain/exceptions';
import { NextFunction, Request, Response } from 'express';

export type ErrorResponse = {
  message: string;
  statusCode: number;
  code: string;
};

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof DomainException) {
    res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    });
  }
}

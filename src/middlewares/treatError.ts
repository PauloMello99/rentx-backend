import { NextFunction, Request, Response } from "express";

import { AppError } from "errors/AppError";

export async function treatError(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message }).send();
  }

  return response
    .status(500)
    .json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    })
    .send();
}

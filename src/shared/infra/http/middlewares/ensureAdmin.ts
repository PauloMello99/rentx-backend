import { NextFunction, Request, Response } from "express";
import { AppError } from "shared/errors/AppError";
import { UsersRepository } from "modules/accounts/infra/typeorm/repositories/UsersRepository";

export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.user;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(id);

    if (!user.isAdmin) {
      throw new AppError("User is not admin");
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.message, error.statusCode);
    }

    throw new AppError("Token is invalid", 401);
  }
}

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "shared/errors/AppError";
import { UsersRepository } from "modules/accounts/infra/typeorm/repositories/UsersRepository";

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(token, "9be36ae892270732c64c4cb11254943b");

    const user_id = typeof sub === "function" ? sub() : sub;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exist", 401);
    }

    request.user = { id: user_id };

    next();
  } catch (error) {
    throw new AppError("Token is invalid", 401);
  }
}

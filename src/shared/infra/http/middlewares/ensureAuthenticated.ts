import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "shared/errors/AppError";
import { SECRET_REFRESH_TOKEN } from "config/auth";
import { UserTokensRepository } from "modules/accounts/infra/typeorm/repositories/UserTokensRepository";

interface IPayload {
  sub: string;
}

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
    const { sub: user_id } = verify(token, SECRET_REFRESH_TOKEN) as IPayload;

    const usersRepository = new UserTokensRepository();

    const user = await usersRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!user) {
      throw new AppError("User does not exist", 401);
    }

    request.user = { id: user_id };

    next();
  } catch (error) {
    throw new AppError("Token is invalid", 401);
  }
}

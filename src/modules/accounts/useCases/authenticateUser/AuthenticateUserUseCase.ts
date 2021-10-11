import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "shared/container/providers/DateProvider/IDateProvider";

import { AppError } from "shared/errors/AppError";

import {
  REFRESH_TOKEN_EXPIRES_DAYS,
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET_REFRESH_TOKEN,
  SECRET_TOKEN,
  TOKEN_EXPIRES_IN,
} from "config/auth";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    const token = sign({}, SECRET_TOKEN, {
      subject: user.id,
      expiresIn: TOKEN_EXPIRES_IN,
    });

    const refresh_token = sign({ email }, SECRET_REFRESH_TOKEN, {
      subject: user.id,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const expires_date = this.dateProvider.addDays(REFRESH_TOKEN_EXPIRES_DAYS);

    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date,
    });

    const response: IResponse = {
      token,
      refresh_token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return response;
  }
}

export { AuthenticateUserUseCase };

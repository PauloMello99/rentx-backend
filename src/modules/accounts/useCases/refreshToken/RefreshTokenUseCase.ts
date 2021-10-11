import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUserTokensRepository } from "modules/accounts/repositories/IUserTokensRepository";

import { AppError } from "shared/errors/AppError";
import { IDateProvider } from "shared/container/providers/DateProvider/IDateProvider";

import {
  REFRESH_TOKEN_EXPIRES_DAYS,
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET_REFRESH_TOKEN,
  SECRET_TOKEN,
  TOKEN_EXPIRES_IN,
} from "config/auth";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const decode = verify(token, SECRET_REFRESH_TOKEN);
    const { sub: user_id, email } = decode as IPayload;

    const userToken = await this.userTokensRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!userToken) {
      throw new AppError("Refresh token does not exist");
    }

    await this.userTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, SECRET_REFRESH_TOKEN, {
      subject: user_id,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const newToken = sign({}, SECRET_TOKEN, {
      subject: user_id,
      expiresIn: TOKEN_EXPIRES_IN,
    });

    const expires_date = this.dateProvider.addDays(REFRESH_TOKEN_EXPIRES_DAYS);

    await this.userTokensRepository.create({
      user_id: user_id,
      refresh_token,
      expires_date,
    });

    return { token: newToken, refresh_token };
  }
}

export { RefreshTokenUseCase };

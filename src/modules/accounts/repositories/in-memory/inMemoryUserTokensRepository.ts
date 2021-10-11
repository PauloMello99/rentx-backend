import { ICreateUserTokenDTO } from "modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "modules/accounts/infra/typeorm/entities/UserToken";
import { IUserTokensRepository } from "../IUserTokensRepository";

class InMemoryUserTokensRepository implements IUserTokensRepository {
  userTokens: UserToken[] = [];

  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
    const userToken = this.userTokens.find(
      (ut) => ut.user_id === user_id && ut.refresh_token === refresh_token
    );

    return userToken;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const userToken = this.userTokens.find((ut) => ut.refresh_token === refresh_token);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.userTokens.find((ut) => ut.id === id);
    this.userTokens.slice(this.userTokens.indexOf(userToken), 1);
  }
}

export { InMemoryUserTokensRepository };

import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUserTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken>;
  findByRefreshToken(refresh_token: string): Promise<UserToken>;
  deleteById(id: string): Promise<void>;
}

export { IUserTokensRepository };

import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

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
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect");
    }

    const passwordMatch = compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    const token = sign({}, "9be36ae892270732c64c4cb11254943b", {
      subject: user.id,
      expiresIn: "1d",
    });

    const response: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return response;
  }
}

export { AuthenticateUserUseCase };

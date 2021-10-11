import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { resolve } from "path";

import { IUsersRepository } from "modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "shared/container/providers/DateProvider/IDateProvider";

import { AppError } from "shared/errors/AppError";
import { IEmailProvider } from "shared/container/providers/EmailProvider/IEmailProvider";

@injectable()
class SendForgotPasswordEmailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("EmailProvider")
    private emailProvider: IEmailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exist");
    }

    const templatePath = resolve(__dirname, "..", "..", "views", "emails", "forgotPassword.hbs");

    const token = uuidV4();
    const expires_date = this.dateProvider.addHours(3);

    await this.userTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_EMAIL_URL}${token}`,
    };

    await this.emailProvider.sendEmail(email, "Recuperação de senha", variables, templatePath);
  }
}

export { SendForgotPasswordEmailUseCase };

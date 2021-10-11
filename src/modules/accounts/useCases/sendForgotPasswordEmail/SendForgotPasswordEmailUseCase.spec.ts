import "reflect-metadata";

import { SendForgotPasswordEmailUseCase } from "./SendForgotPasswordEmailUseCase";

import { InMemoryUsersRepository } from "modules/accounts/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryUserTokensRepository } from "modules/accounts/repositories/in-memory/inMemoryUserTokensRepository";
import { InMemoryEmailProvider } from "shared/container/providers/EmailProvider/in-memory/InMemoryEmailProvider";

import { DayjsDateProvider } from "shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "shared/errors/AppError";

let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUserTokensRepository: InMemoryUserTokensRepository;

let dateProvider: DayjsDateProvider;
let emailProvider: InMemoryEmailProvider;

describe("Send Forgot Email", () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider();

    emailProvider = new InMemoryEmailProvider();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUserTokensRepository = new InMemoryUserTokensRepository();

    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      inMemoryUsersRepository,
      inMemoryUserTokensRepository,
      dateProvider,
      emailProvider
    );
  });

  it("should be able to send an email to user", async () => {
    const sendEmailSpy = jest.spyOn(emailProvider, "sendEmail");

    const email = "john@doe.com";

    await inMemoryUsersRepository.create({
      driver_license: "123456",
      name: "John Doe",
      password: "1234",
      email,
    });

    await sendForgotPasswordEmailUseCase.execute(email);

    expect(sendEmailSpy).toHaveBeenCalled();
  });

  it("should  not be able to send an email if user does not exist", async () => {
    await expect(sendForgotPasswordEmailUseCase.execute("not_john@doe.com")).rejects.toEqual(
      new AppError("User does not exist")
    );
  });

  it("should be able to create an userToken", async () => {
    const createUserTokenSpy = jest.spyOn(inMemoryUserTokensRepository, "create");

    const email = "john@doe.com";

    await inMemoryUsersRepository.create({
      driver_license: "123456",
      name: "John Doe",
      password: "1234",
      email,
    });

    await sendForgotPasswordEmailUseCase.execute(email);

    expect(createUserTokenSpy).toHaveBeenCalled();
  });
});

import { InMemoryUsersRepository } from "modules/accounts/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "modules/accounts/dtos/ICreateUserDTO";
import { AppError } from "shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "000123",
      email: "john@doe.com",
      password: "123",
      name: "John Doe",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user", {
      name: user.name,
      email: user.email,
    });
  });

  it("should not be able to authenticate when user does not exists", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "anypassword",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });

  it("should not be able to authenticate user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "000123",
      email: "john@doe.com",
      password: "123",
      name: "John Doe",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect_password",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });
});

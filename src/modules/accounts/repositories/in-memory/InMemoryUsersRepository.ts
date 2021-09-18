import { User } from "modules/accounts/infra/typeorm/entities/User";
import { ICreateUserDTO } from "modules/dtos/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

class InMemoryUsersRepository implements IUsersRepository {
  users: User[] = [];

  async create({ driver_license, email, name, password }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      driver_license,
      email,
      name,
      password,
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: string): Promise<User> {
    return this.users.find((u) => u.id === id);
  }
}

export { InMemoryUsersRepository };

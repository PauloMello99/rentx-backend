import { ICreateRentalDTO } from "modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findByUserId(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({ where: { user_id }, relations: ["car"] });
    return rentals;
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);
    return rental;
  }

  async findOpenRentalByCarId(id: string): Promise<Rental> {
    const openByCar = await this.repository.findOne({ where: { car_id: id, end_date: null } });
    return openByCar;
  }

  async findOpenRentalByUserId(id: string): Promise<Rental> {
    const openByUser = await this.repository.findOne({ where: { user_id: id, end_date: null } });
    return openByUser;
  }

  async create({
    car_id,
    expected_return_date,
    user_id,
    end_date,
    id,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);
    return rental;
  }
}

export { RentalsRepository };

import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "modules/cars/repositories/ICarsRepository";
import { AppError } from "shared/errors/AppError";
import { Car } from "modules/cars/infra/typeorm/entities/Car";

interface IRequest {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  brand: string;
  category_id: string;
  fine_amount: number;
}

@injectable()
class CreateCarUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    name,
    description,
    daily_rate,
    brand,
    category_id,
    license_plate,
    fine_amount,
  }: IRequest): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(license_plate);

    if (carAlreadyExists) {
      throw new AppError("Car already exists");
    }

    const car = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      brand,
      category_id,
      license_plate,
      fine_amount,
    });

    return car;
  }
}

export { CreateCarUseCase };

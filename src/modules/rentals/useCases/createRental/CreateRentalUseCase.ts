import { Rental } from "modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ car_id, user_id, expected_return_date }: IRequest): Promise<Rental> {
    const minimumRentalHours = 24;
    const carWithOpenRental = await this.rentalsRepository.findOpenRentalByCarId(car_id);

    if (carWithOpenRental) {
      throw new AppError("There's a rental in progress for this car");
    }

    const userWithOpenRental = await this.rentalsRepository.findOpenRentalByUserId(user_id);

    if (userWithOpenRental) {
      throw new AppError("There's a rental in progress for this user");
    }

    const dateNow = this.dateProvider.dateNow();
    const rentalHours = this.dateProvider.compareInHours(expected_return_date, dateNow);

    if (rentalHours < minimumRentalHours) {
      throw new AppError("Minimum rental time is 24 hours");
    }

    const rental = await this.rentalsRepository.create({ user_id, car_id, expected_return_date });

    return rental;
  }
}

export { CreateRentalUseCase };

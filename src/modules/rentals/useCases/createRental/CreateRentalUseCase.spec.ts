import dayjs from "dayjs";

import { InMemoryCarsRepository } from "modules/cars/repositories/in-memory/InMemoryCarsRepository";
import { InMemoryRentalsRepository } from "modules/rentals/repositories/in-memory/InMemoryRentalsRepository";

import { DayjsDateProvider } from "shared/container/providers/DateProvider/implementations/DayjsDateProvider";

import { AppError } from "shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;
let inMemoryRentalsRepository: InMemoryRentalsRepository;
let inMemoryCarsRepository: InMemoryCarsRepository;

describe("Create Rental", () => {
  beforeEach(() => {
    inMemoryRentalsRepository = new InMemoryRentalsRepository();
    inMemoryCarsRepository = new InMemoryCarsRepository();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      inMemoryRentalsRepository,
      dayjsDateProvider,
      inMemoryCarsRepository
    );
  });

  it("should be able to create a new rental", async () => {
    const expected_return_date = dayjs().add(25, "hours").toDate();

    const car = await inMemoryCarsRepository.create({
      name: "Car Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "ABC123",
      brand: "Car Brand",
      category_id: "123",
      fine_amount: 100,
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: "321",
      expected_return_date,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
    expect(rental).toHaveProperty("user_id", "321");
    expect(rental).toHaveProperty("car_id", car.id);
    expect(rental).toHaveProperty("expected_return_date", expected_return_date);
  });

  it("should not be able to create a new rental if there is another open to same user", async () => {
    const user_id = "123";

    const firstCar = await inMemoryCarsRepository.create({
      name: "Car Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "ABC123",
      brand: "Car Brand",
      category_id: "123",
      fine_amount: 100,
    });

    const secondCar = await inMemoryCarsRepository.create({
      name: "Car Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "ABC123",
      brand: "Car Brand",
      category_id: "123",
      fine_amount: 100,
    });

    const expected_return_date = dayjs().add(25, "hours").toDate();

    await createRentalUseCase.execute({
      car_id: firstCar.id,
      expected_return_date,
      user_id,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: secondCar.id,
        expected_return_date,
        user_id,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for this user"));
  });

  it("should not be able to create a new rental if there is another open to same car", async () => {
    const car = await inMemoryCarsRepository.create({
      name: "Car Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "ABC123",
      brand: "Car Brand",
      category_id: "123",
      fine_amount: 100,
    });

    const expected_return_date = dayjs().add(25, "hours").toDate();

    await createRentalUseCase.execute({
      user_id: "123",
      expected_return_date,
      car_id: car.id,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "321",
        expected_return_date,
        car_id: car.id,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for this car"));
  });

  it("should not be able to create a new rental if expected return date is less than 24 hours", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "123",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Minimum rental time is 24 hours"));
  });
});

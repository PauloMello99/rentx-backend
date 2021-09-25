import dayjs from "dayjs";

import { InMemoryRentalsRepository } from "modules/rentals/repositories/in-memory/InMemoryRentalsRepository";
import { DayjsDateProvider } from "shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let dayjsDateProvider: DayjsDateProvider;
let inMemoryRentalsRepository: InMemoryRentalsRepository;

describe("Create Rental", () => {
  beforeEach(() => {
    inMemoryRentalsRepository = new InMemoryRentalsRepository();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(inMemoryRentalsRepository, dayjsDateProvider);
  });

  it("should be able to create a new rental", async () => {
    const expected_return_date = dayjs().add(1, "day").toDate();

    const rental = await createRentalUseCase.execute({
      car_id: "123",
      user_id: "321",
      expected_return_date,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
    expect(rental).toHaveProperty("user_id", "321");
    expect(rental).toHaveProperty("car_id", "123");
    expect(rental).toHaveProperty("expected_return_date", expected_return_date);
  });

  it("should not be able to create a new rental if there is another open to same user", async () => {
    const user_id = "123";

    const expected_return_date = dayjs().add(1, "day").toDate();

    await createRentalUseCase.execute({
      car_id: "123",
      expected_return_date,
      user_id,
    });

    expect(async () =>
      createRentalUseCase.execute({
        car_id: "123",
        expected_return_date,
        user_id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there is another open to same car", async () => {
    const car_id = "123";

    const expected_return_date = dayjs().add(1, "day").toDate();

    await createRentalUseCase.execute({
      user_id: "123",
      expected_return_date,
      car_id,
    });

    expect(async () =>
      createRentalUseCase.execute({
        user_id: "321",
        expected_return_date,
        car_id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if expected return date is less than 24 hours", async () => {
    expect(async () =>
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "123",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

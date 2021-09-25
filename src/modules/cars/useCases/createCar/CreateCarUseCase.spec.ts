import { InMemoryCarsRepository } from "modules/cars/repositories/in-memory/InMemoryCarsRepository";
import { AppError } from "shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let inMemoryCarsRepository: InMemoryCarsRepository;
let createCarUseCase: CreateCarUseCase;

describe("Create Car", () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository();
    createCarUseCase = new CreateCarUseCase(inMemoryCarsRepository);
  });

  it("should be able to create a car", async () => {
    const car = {
      name: "Car Name",
      brand: "Car Brand",
      category_id: "1234",
      daily_rate: 100,
      description: "Car Description",
      fine_amount: 100,
      license_plate: "ABC00123",
    };

    const createdCar = await createCarUseCase.execute(car);

    expect(createdCar).toHaveProperty("id");
  });

  it("should not be able to create a car if license plate already exists", async () => {
    const car = {
      name: "Car Name",
      brand: "Car Brand",
      category_id: "1234",
      daily_rate: 100,
      description: "Car Description",
      fine_amount: 100,
      license_plate: "ABC00123",
    };

    await createCarUseCase.execute(car);

    expect(async () => createCarUseCase.execute(car)).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a car with available true by default", async () => {
    const car = {
      name: "Car Name",
      brand: "Car Brand",
      category_id: "1234",
      daily_rate: 100,
      description: "Car Description",
      fine_amount: 100,
      license_plate: "ABC00123",
    };

    const createdCar = await createCarUseCase.execute(car);

    expect(createdCar.available).toBe(true);
  });
});

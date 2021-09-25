import { InMemoryCarsRepository } from "modules/cars/repositories/in-memory/InMemoryCarsRepository";
import { InMemorySpecificationsRepository } from "modules/cars/repositories/in-memory/InMemorySpecificationsRepository";
import { AppError } from "shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let inMemoryCarsRepository: InMemoryCarsRepository;
let inMemorySpecificationsRepository: InMemorySpecificationsRepository;

describe("Create Car Speficication", () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository();
    inMemorySpecificationsRepository = new InMemorySpecificationsRepository();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      inMemoryCarsRepository,
      inMemorySpecificationsRepository
    );
  });

  it("should not be able to add a new specification to a non-existent car", async () => {
    const car_id = "123";
    const specifications_id = ["321"];

    expect(async () =>
      createCarSpecificationUseCase.execute({ car_id, specifications_id })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to add a new specification to a car", async () => {
    const car = await inMemoryCarsRepository.create({
      name: "Car Name",
      brand: "Car Brand",
      category_id: "1234",
      daily_rate: 100,
      description: "Car Description",
      fine_amount: 100,
      license_plate: "ABC00123",
    });

    const specification = await inMemorySpecificationsRepository.create({
      name: "Test",
      description: "Test",
    });

    const specifications_id = [specification.id];

    const carWithSpecifications = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(carWithSpecifications).toHaveProperty("specifications");
    expect(carWithSpecifications.specifications.length).toBe(1);
  });
});

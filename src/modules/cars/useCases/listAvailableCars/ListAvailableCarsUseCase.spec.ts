import { InMemoryCarsRepository } from "modules/cars/repositories/in-memory/InMemoryCarsRepository";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let inMemoryCarsRepository: InMemoryCarsRepository;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List cars", () => {
  beforeEach(() => {
    inMemoryCarsRepository = new InMemoryCarsRepository();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(inMemoryCarsRepository);
  });

  it("should be able to list all available cars", async () => {
    const car = await inMemoryCarsRepository.create({
      name: "Car Name 1",
      brand: "Car Brand 1",
      description: "Car Description 1",
      daily_rate: 100,
      category_id: "category_id",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const cars = await listAvailableCarsUseCase.execute();

    expect(cars.length).toBe(1);
    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    await inMemoryCarsRepository.create({
      name: "Car Name 1",
      brand: "Car Brand 1",
      description: "Car Description 1",
      daily_rate: 100,
      category_id: "category_id",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const lastCar = await inMemoryCarsRepository.create({
      name: "Car Name 2",
      brand: "Car Brand 2",
      description: "Car Description 2",
      daily_rate: 100,
      category_id: "category_id",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({ name: lastCar.name });

    expect(cars.length).toBe(1);
    expect(cars).toEqual([lastCar]);
  });

  it("should be able to list all available cars by brand", async () => {
    await inMemoryCarsRepository.create({
      name: "Car Name 1",
      brand: "Car Brand 1",
      description: "Car Description 1",
      daily_rate: 100,
      category_id: "category_id",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const lastCar = await inMemoryCarsRepository.create({
      name: "Car Name 2",
      brand: "Car Brand 2",
      description: "Car Description 2",
      daily_rate: 100,
      category_id: "category_id",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({ brand: lastCar.brand });

    expect(cars.length).toBe(1);
    expect(cars).toEqual([lastCar]);
  });

  it("should be able to list all available cars by category", async () => {
    await inMemoryCarsRepository.create({
      name: "Car Name 1",
      brand: "Car Brand 1",
      description: "Car Description 1",
      daily_rate: 100,
      category_id: "category_id",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const lastCar = await inMemoryCarsRepository.create({
      name: "Car Name 2",
      brand: "Car Brand 2",
      description: "Car Description 2",
      daily_rate: 100,
      category_id: "category_id2",
      license_plate: "ABC312",
      fine_amount: 100,
    });

    const cars = await listAvailableCarsUseCase.execute({ category_id: lastCar.category_id });

    expect(cars.length).toBe(1);
    expect(cars).toEqual([lastCar]);
  });
});

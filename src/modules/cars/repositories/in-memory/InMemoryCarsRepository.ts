import { ICreateCarDTO } from "modules/cars/dtos/ICreateCarDTO";
import { Car } from "modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository, CarListFilters } from "../ICarsRepository";

class InMemoryCarsRepository implements ICarsRepository {
  cars: Car[] = [];

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex((car) => car.id === id);
    this.cars[findIndex].available = available;
  }

  async create({
    id,
    name,
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    const carDTO = {
      id: car.id,
      specifications: car.specifications,
      name,
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
    };

    if (id) {
      carDTO.id = id;
    }

    if (specifications) {
      carDTO.specifications = specifications;
    }

    Object.assign(car, carDTO);

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(filters: CarListFilters): Promise<Car[]> {
    return this.cars.filter((car) => {
      if (!car.available) {
        return false;
      }

      if (!filters) {
        return car;
      }

      const { brand, category_id, name } = filters;

      return (
        (brand && car.brand === brand) ||
        (name && car.name === name) ||
        (category_id && car.category_id === category_id)
      );
    });
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }
}

export { InMemoryCarsRepository };

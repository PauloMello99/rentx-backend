import { ICreateCarDTO } from "../dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

interface CarListFilters {
  brand?: string;
  name?: string;
  category_id?: string;
}

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(filters?: CarListFilters): Promise<Car[]>;
  findById(id: string): Promise<Car>;
}

export { ICarsRepository, CarListFilters };

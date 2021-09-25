import { Specification } from "../infra/typeorm/entities/Specification";

interface ICreateCarDTO {
  id?: string;
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  brand: string;
  category_id: string;
  fine_amount: number;
  specifications?: Specification[];
}

export { ICreateCarDTO };

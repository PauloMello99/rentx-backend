import fs from "fs";
import csvParse from "csv-parse";

import { inject, injectable } from "tsyringe";
import { AppError } from "errors/AppError";
import { CategoriesRepository } from "modules/cars/repositories/implementations/CategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: CategoriesRepository
  ) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const categories: IImportCategory[] = [];

      const stream = fs.createReadStream(file.path);
      const parseFile = csvParse();
      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [name, description] = line;
          categories.push({ name, description });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(categories);
        })
        .on("error", reject);
    });
  }

  async createCategories(categories: IImportCategory[]): Promise<void> {
    categories.map(async (category) => {
      const { name, description } = category;

      const categoryAlreadyExists = await this.categoriesRepository.findByName(name);

      if (categoryAlreadyExists) {
        throw new AppError("Category already exists");
      }

      await this.categoriesRepository.create({ name, description });
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    this.createCategories(categories);
  }
}

export { ImportCategoryUseCase };

import { InMemoryCategoriesRepository } from "modules/cars/repositories/in-memory/InMemoryCategoriesRepository";
import { AppError } from "shared/errors/AppError";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;

describe("Create Category", () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    createCategoryUseCase = new CreateCategoryUseCase(inMemoryCategoriesRepository);
  });

  it("should be able to create a new category", async () => {
    const category = {
      name: "Category Test",
      description: "Category Description Test",
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    const createdCategory = await inMemoryCategoriesRepository.findByName(category.name);

    expect(createdCategory).toHaveProperty("id");
  });

  it("should not be able to create a new category with same name", async () => {
    const category = {
      name: "Category Test",
      description: "Category Description Test",
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    expect(async () =>
      createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { CreateSpecificationController } from "modules/cars/useCases/createSpecification/CreateSpecificationController";
import { ListSpecificationsController } from "modules/cars/useCases/listSpecifications/ListSpecificationsController";

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();

specificationsRoutes.post("/", ensureAuthenticated, createSpecificationController.handle);
specificationsRoutes.get("/", ensureAuthenticated, listSpecificationsController.handle);

export { specificationsRoutes };

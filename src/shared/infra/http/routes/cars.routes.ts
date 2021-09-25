import { Router } from "express";
import multer from "multer";

import uploadConfig from "config/upload";

import { CreateCarController } from "modules/cars/useCases/createCar/CreateCarController";
import { CreateCarSpecificationController } from "modules/cars/useCases/createCarSpecification/CreateCarSpeficicationController";
import { ListAvailableCarsController } from "modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImagesController } from "modules/cars/useCases/uploadCarImages/UploadCarImagesController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const carRoutes = Router();

const uploadCarImages = multer(uploadConfig.upload("./tmp/cars"));

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

carRoutes.post("/", ensureAuthenticated, ensureAdmin, createCarController.handle);
carRoutes.get("/available", listAvailableCarsController.handle);
carRoutes.post(
  "/specifications/:id",
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
);
carRoutes.post(
  "/images/:id",
  ensureAuthenticated,
  ensureAdmin,
  uploadCarImages.array("images"),
  uploadCarImagesController.handle
);

export { carRoutes };

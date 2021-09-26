import express from "express";
import swaggerUI from "swagger-ui-express";
import "express-async-errors";

import createConnection from "shared/infra/typeorm";
import "shared/container";

import { router } from "./routes";

import swaggerFile from "../../../../swagger.json";
import { treatError } from "./middlewares/treatError";

createConnection();

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(router);
app.use(treatError);

export { app };

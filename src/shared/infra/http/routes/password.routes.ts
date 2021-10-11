import { Router } from "express";

import { ResetUserPasswordController } from "modules/accounts/useCases/resetUserPassword/ResetUserPasswordController";
import { SendForgotPasswordEmailController } from "modules/accounts/useCases/sendForgotPasswordEmail/SendForgotPasswordEmailController";

const passwordRoutes = Router();

const sendForgotPasswordEmailController = new SendForgotPasswordEmailController();
const resetUserPasswordController = new ResetUserPasswordController();

passwordRoutes.post("/forgot", sendForgotPasswordEmailController.handle);
passwordRoutes.post("/reset", resetUserPasswordController.handle);

export { passwordRoutes };

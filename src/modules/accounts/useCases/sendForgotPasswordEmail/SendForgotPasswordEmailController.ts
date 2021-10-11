import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordEmailUseCase } from "./SendForgotPasswordEmailUseCase";

class SendForgotPasswordEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmailController = container.resolve(SendForgotPasswordEmailUseCase);

    await sendForgotPasswordEmailController.execute(email);

    return response.status(200).send();
  }
}

export { SendForgotPasswordEmailController };

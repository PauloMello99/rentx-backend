import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

import { IEmailProvider } from "../IEmailProvider";

class EtherealEmailProvider implements IEmailProvider {
  private client: Transporter;

  constructor() {
    this.createClient();
  }

  private async createClient() {
    try {
      const account = await nodemailer.createTestAccount();

      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    } catch (err) {
      console.error(`EtherealMailProvider - Error:\n${err}`);
    }
  }

  async sendEmail(to: string, subject: string, variables: any, path: string): Promise<void> {
    if (!this.client) {
      await this.createClient();
    }

    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreply@rentx.com.br>",
      subject,
      html: templateHTML,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealEmailProvider };

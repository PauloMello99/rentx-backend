import { IEmailProvider } from "../IEmailProvider";

class InMemoryEmailProvider implements IEmailProvider {
  private messages: any[] = [];

  async sendEmail(to: string, subject: string, variables: any, path: string): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}

export { InMemoryEmailProvider };

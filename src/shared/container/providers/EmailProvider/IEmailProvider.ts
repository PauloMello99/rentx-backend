interface IEmailProvider {
  sendEmail(to: string, subject: string, variables: any, path: string): Promise<void>;
}

export { IEmailProvider };

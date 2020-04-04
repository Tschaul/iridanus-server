import { MailSender, MailPayload } from "../../infrastructure/mail/mail-sender";
import { AccountConfirmationMail } from "../../mails/account-confirmation-mail";
import { Container, injectable } from "inversify";

@injectable()
export class MailSenderMock {
  async send(mail: MailPayload) {
    // noop
  }
}

@injectable()
export class AccountConfirmationMailMock {

  tokens = new Map<string, string>();

  async send(id: string, token: string) {
    this.tokens.set(id, token);
  }
}

export function registerMailMocks(container: Container) {
  container.unbind(MailSender);
  container.bind(MailSender).to(MailSenderMock as any);
  container.unbind(AccountConfirmationMail);
  container.bind(AccountConfirmationMail).to(AccountConfirmationMailMock as any);
}
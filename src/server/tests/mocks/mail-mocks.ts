import { MailSender } from "../../infrastructure/message-sending/mail-sender";
import { AccountConfirmationMessage} from "../../messages/account-confirmation-message";
import { Container, injectable } from "inversify";
import { MessagePayload } from "../../infrastructure/message-sending/message-payload";
import { TelegramConnection } from "../../infrastructure/message-sending/telegram-bot";

@injectable()
export class MailSenderMock {
  async send(mail: MessagePayload) {
    // noop
  }
}

@injectable()
export class AccountConfirmationMessageMock {

  tokens = new Map<string, string>();

  async send(id: string, token: string) {
    this.tokens.set(id, token);
  }
}

@injectable()
export class TelegramConnectionMock {

  async send(mail: MessagePayload) {
    return;
  }
}

export function registerMessageMocks(container: Container) {
  container.unbind(TelegramConnection);
  container.bind(TelegramConnection).to(TelegramConnectionMock as any);
  container.unbind(MailSender);
  container.bind(MailSender).to(MailSenderMock as any);
  container.unbind(AccountConfirmationMessage);
  container.bind(AccountConfirmationMessage).to(AccountConfirmationMessageMock as any);
}
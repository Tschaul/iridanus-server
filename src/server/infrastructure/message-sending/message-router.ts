import { injectable } from "inversify";
import { createTransport, getTestMessageUrl } from "nodemailer";
import { Environment } from "../../environment/environment";
import { UserRepository } from "../../repositories/users/user-repository";
import { Logger } from "../../../core/infrastructure/logger";
import { MessagePayload } from "./message-payload";
import { MailSender } from "./mail-sender";
import { TelegramConnection } from "./telegram-bot";

@injectable()
export class MessageRouter {
  constructor(private userRepository: UserRepository, private logger: Logger, private mailSender: MailSender, private telegramBot: TelegramConnection) {
  }

  async send(mail: MessagePayload, preferTelegram?: boolean) {

    const userInfos = await this.userRepository.getUserInfos(mail.recipients);

    const telegramUsers: string[] = [];
    const mailUsers: string[] = [];

    userInfos.forEach(it => {
      if (it.emailConfirmed && it.telegram.confirmed && preferTelegram) {
        telegramUsers.push(it.id)
      } else {
        if (it.emailConfirmed) {
          mailUsers.push(it.id)
        }
      }
    })

    if (mailUsers.length) {
      await this.mailSender.send({ ...mail, recipients: mailUsers });
    }

    if (telegramUsers.length) {
      await this.telegramBot.send({ ...mail, recipients: telegramUsers });
    }
  }
}
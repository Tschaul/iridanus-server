import { injectable } from 'inversify';
import TelegramBot from 'node-telegram-bot-api';
import { Environment } from '../../environment/environment';
import { UserRepository } from '../../repositories/users/user-repository';
import { MessagePayload } from './message-payload';

@injectable()
export class TelegramConnection {

  readonly bot: TelegramBot
  readonly enabled: boolean;

  constructor(
    private userRepository: UserRepository,
    environment: Environment
  ) {

    this.enabled = !!environment.telegramBotToken;

    if (this.enabled) {
      this.bot = new TelegramBot(environment.telegramBotToken, { polling: true });

      this.bot.onText(/\/start/, async (msg, match) => {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId, 'Welcome to the iridanus bot. Type /code [user] [code] to set up notifications');
      });

      this.bot.onText(/\/code (?=.{3,15})(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.]) ([0-9][0-9][0-9][0-9])/, async (msg, match) => {
        const chatId = msg.chat.id;
        // return;
        const userId = (match && match[0].split(' ')[1]) ?? ''
        const code = (match && match[0].split(' ')[2]) ?? ''

        console.log({ userId, code })
        await this.userRepository.confirmUserTelegram(userId, code, chatId)

        await this.bot.sendMessage(chatId, `Thank you ${userId}. This chat has been set up for notifications. Type /disable to disable notifications again.`);
      });

      this.bot.onText(/\/disable/, async (msg, match) => {
        const chatId = msg.chat.id;

        await this.userRepository.unconfirmUserTelegram(chatId)

        await this.bot.sendMessage(chatId, `Telegram notifications are now disabled.`);
      });
    }


  }

  private async sendMessage(userId: string, message: string) {
    if (this.enabled) {
      const users = await this.userRepository.getUserInfos([userId])
      const user = users[0]

      if (!user || !user.emailConfirmed || !user.telegram.confirmed) {
        return;
      }

      const chatId = user.telegram.chatId;

      await this.bot.sendMessage(chatId, message);
    }
  }

  async send(mail: MessagePayload) {
    for (const recipient of mail.recipients) {
      await this.sendMessage(recipient, mail.subject + '\n\n' + mail.text)
    }
  }
}

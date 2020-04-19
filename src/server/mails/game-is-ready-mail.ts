import { injectable } from "inversify";
import { MailSender } from "../infrastructure/mail/mail-sender";
import { Environment } from "../environment/environment";
import { GameInfo } from "../../shared/model/v1/game-info";

@injectable()
export class GameIsReadyMail {

  constructor(private mailSender: MailSender, private environment: Environment) {}

  async send(gameInfo: GameInfo, gameStartTimestamp: number) {

    const recipients = Object.getOwnPropertyNames(gameInfo.players);
    const gameId = gameInfo.id;

    const gameStartDate = new Date(gameStartTimestamp).toISOString();

    await this.mailSender.send({
      recipients: recipients,
      subject: `Your Iridanus game '${gameId}' will start soon`,
      text: 
`Hello ${recipients.join(', ')}

your Iridanus game '${gameId}' is ready and will start at ${gameStartDate}. Please place your initial orders.

${this.environment.baseUrl}`
    })
  }
}
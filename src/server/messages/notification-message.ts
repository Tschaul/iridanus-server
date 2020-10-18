import { injectable } from "inversify";
import { MailSender } from "../infrastructure/message-sending/mail-sender";
import { Environment } from "../environment/environment";
import { GameNotification } from "../../shared/model/v1/notification";
import { MessageRouter } from "../infrastructure/message-sending/message-router";

@injectable()
export class NotificationMessage {

  constructor(private messageRouter: MessageRouter, private environment: Environment) { }

  async send(playerId: string, gameId: string, notifications: GameNotification[]) {

    if (!notifications.length) {
      return;
    }

    notifications.sort((a, b) => importance(b) - importance(a))

    await this.messageRouter.send({
      recipients: [playerId],
      subject: notifications[0].type + ' Iridanus notification from game ' + gameId,
      text:
        `Hi ${playerId},

there are important updates in your Iridanus game ${gameId}:

${notifications.map(it => '- ' + it.type).join('\n')}

Have a look now: ${this.environment.baseUrl}`
    }, true)
  }
}

function importance(notification: GameNotification): number {
  switch (notification.type) {
    case 'GAME_ENDED':
    case 'GAME_STARTED':
    case 'HOME_WORLD_LOST':
      return 10;
    case 'WORLD_IS_UNDER_ATTACK':
    case 'WORLD_CAPTURED':
    case 'ENGAGING_THE_ENEMY':
    case 'ENEMY_WARP_IN_DETECTED':
      return 5;
    default:
      return 1;
  }
}
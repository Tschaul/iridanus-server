import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { NotificationMarkAsReadCommand } from "../../../../shared/messages/commands/notification-commands";
import { GameRepository } from "../../../repositories/games/games-repository";
import { GameSetupProvider } from "../../../../core/game-setup-provider";

@injectable()
export class NotificationsMarkAsReadExecutor implements CommandExecutor<NotificationMarkAsReadCommand> {
  authenticationRequired = true;

  constructor(
    private repository: GameRepository,
    private setup: GameSetupProvider
  ) { }

  async execute(command: NotificationMarkAsReadCommand, userId: string) {
    await this.repository.markNotificationsAsRead(this.setup.gameId, userId, command.notificationIds)
  }

}
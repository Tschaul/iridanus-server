import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { ToggleSpectatorForGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GameRepository } from "../../../repositories/games/games-repository";

@injectable()
export class ToggleSpectatorForGameExecutor implements CommandExecutor<ToggleSpectatorForGameCommand> {
  authenticationRequired = true;

  constructor(private repository: GameRepository) {

  }

  async execute(command: ToggleSpectatorForGameCommand, userId: string) {
    await this.repository.toggleSpecatorMode(command.gameId, userId);
  }

}
import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { ReadyForGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GamesRepository } from "../../../repositories/games/games-repository";

@injectable()
export class ReadyForGameExecutor implements CommandExecutor<ReadyForGameCommand> {

  constructor(private repository: GamesRepository) {

  }

  async execute(command: ReadyForGameCommand, userId: string) {
    await this.repository.setReady(command.gameId, userId);
  }

}
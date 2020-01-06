import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { SetRulesForGameCommand, SetMapForGameCommand, JoinGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GamesRepository } from "../../../repositories/games/games-repository";

@injectable()
export class JoinGameExecutor implements CommandExecutor<JoinGameCommand> {

  constructor(private repository: GamesRepository) {

  }

  async execute(command: JoinGameCommand, userId: string) {
    await this.repository.joinGame(command.gameId, userId);
  }

}
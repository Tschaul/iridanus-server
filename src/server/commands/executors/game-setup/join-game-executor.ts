import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { JoinGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GameRepository } from "../../../repositories/games/games-repository";

@injectable()
export class JoinGameExecutor implements CommandExecutor<JoinGameCommand> {
  authenticationRequired = true;

  constructor(private repository: GameRepository) {

  }

  async execute(command: JoinGameCommand, userId: string) {
    await this.repository.joinGame(command.gameId, userId);
  }

}
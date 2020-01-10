import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { CreateGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GameRepository } from "../../../repositories/games/games-repository";

@injectable()
export class CreateGameExecutor implements CommandExecutor<CreateGameCommand> {
  authenticationRequired = true;

  constructor(private repository: GameRepository) {

  }

  async execute(command: CreateGameCommand, userId: string) {
    await this.repository.createGame(command.gameId);

    await this.repository.joinGame(command.gameId, userId);
  }

}
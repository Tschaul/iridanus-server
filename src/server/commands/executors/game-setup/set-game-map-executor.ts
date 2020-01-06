import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { SetMapForGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GamesRepository } from "../../../repositories/games/games-repository";

@injectable()
export class SetGameMapGameExecutor implements CommandExecutor<SetMapForGameCommand> {

  constructor(private repository: GamesRepository) {

  }

  async execute(command: SetMapForGameCommand) {
    await this.repository.setMap(command.gameId, command.mapId);
  }

}
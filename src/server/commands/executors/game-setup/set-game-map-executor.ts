import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { SetMapForGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GameRepository } from "../../../repositories/games/games-repository";
import { MapRepository } from "../../../repositories/maps/map-repository";

@injectable()
export class SetGameMapGameExecutor implements CommandExecutor<SetMapForGameCommand> {
  authenticationRequired = true;

  constructor(private gamesRepository: GameRepository, private mapRepository: MapRepository) {

  }

  async execute(command: SetMapForGameCommand) {
    const map = await this.mapRepository.getMapById(command.mapId);
    if (!map.final) {
      throw new Error('Only finlized aps can be selected for a game')
    }
    await this.gamesRepository.setMap(command.gameId, command.mapId);
  }

}
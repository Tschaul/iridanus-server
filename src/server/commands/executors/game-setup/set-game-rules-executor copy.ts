import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { SetRulesForGameCommand } from "../../../../shared/messages/commands/game-commands";
import { GamesRepository } from "../../../repositories/games/games-repository";

@injectable()
export class SetGameRulesGameExecutor implements CommandExecutor<SetRulesForGameCommand> {

  constructor(private repository: GamesRepository) {

  }

  async execute(command: SetRulesForGameCommand) {
    await this.repository.setRules(command.gameId, command.rulesId);
  }

}
import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { CreateGameCommand } from "../../../../shared/messages/commands";
import { GameSetupProvider } from "../../../../core/game-setup-provider";
import { Game } from "../../../../core/game";
import { simpleRules } from "../../../../core/tests/test-config";
import { simpleMap } from "../../../../core/setup/simple-map";
import { Store } from "../../../../core/store";

@injectable()
export class CreateGameExecutor implements CommandExecutor<CreateGameCommand> {

  constructor(private setup: GameSetupProvider, private game: Game, private store: Store) {

  }

  async execute(command: CreateGameCommand) {
    this.setup.rules = simpleRules;
    this.setup.initialState = simpleMap;

    this.store.initialize();

    return this.game.startGameLoop().then(_ => void 0);
  }

}
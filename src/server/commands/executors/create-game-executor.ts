import { injectable } from "inversify";
import { CommandExecutor } from "./command-executor";
import { CreateGameCommand } from "../../../shared/commands";
import { GameSetupProvider } from "../../../core/game-setup-provider";
import { Game } from "../../../core/game";
import { simpleRules } from "../../../core/tests/test-config";
import { simpleMap } from "../../../core/setup/simple-map";
import { Store } from "../../../core/store";

@injectable()
export class CreateGameExecutor implements CommandExecutor {

  constructor(private setup: GameSetupProvider, private game: Game, private store: Store) {

  }

  execute(command: CreateGameCommand, error: (e: string) => void) {
    this.setup.rules = simpleRules;
    this.setup.initialState = simpleMap;

    this.store.initialize();

    this.game.startGameLoop().catch(err => error(err.toString()));
  }

}
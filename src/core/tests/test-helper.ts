import 'reflect-metadata';
import { GameState } from "../state";
import { Clock } from "../infrastructure/clock";
import { Game } from "../game";
import { Logger } from "../infrastructure/logger";
import { Store, ReadonlyStore } from "../store";
import { Container } from "inversify";
import { simpleRules } from "./test-config";
import { registerEventQueues } from "../events/register-queues";
import { registerProjectors } from "../projectors/register-projectors";
import { RandomNumberGenerator, NotSoRandomNumberGenerator } from "../infrastructure/random-number-generator";
import { GameSetupProvider } from "../game-setup-provider";

export function runMap(map: GameState): Promise<GameState> {

  let container = new Container({
    defaultScope: "Singleton"
  });

  container.bind(Clock).toConstantValue(new Clock(0));
  container.bind(Logger).toSelf();
  // container.bind(Logger).to(TestLogger);
  container.bind(RandomNumberGenerator).to(NotSoRandomNumberGenerator);
  container.bind(Store).toSelf();
  container.bind(ReadonlyStore).toSelf();
  container.bind(Game).toSelf();
  container.bind(GameSetupProvider).toSelf();

  const setup =  container.get(GameSetupProvider);
  setup.rules = simpleRules;
  setup.initialState = map;

  registerEventQueues(container);
  registerProjectors(container);

  const store =  container.get(Store);

  store.initialize();

  const game = container.get(Game);

  return game.startGameLoop();
  
}
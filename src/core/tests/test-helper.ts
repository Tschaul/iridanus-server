import 'reflect-metadata';
import { GameState } from "../../shared/model/v1/state";
import { Clock } from "../infrastructure/clock";
import { Game } from "../game";
import { Logger } from "../infrastructure/logger";
import { Store, ReadonlyStore } from "../store";
import { Container } from "inversify";
import { testRules } from "./test-config";
import { registerEventQueues } from "../events/register-queues";
import { registerProjectors } from "../projectors/register-projectors";
import { RandomNumberGenerator, NotSoRandomNumberGenerator } from "../infrastructure/random-number-generator";
import { GameSetupProvider } from "../game-setup-provider";
import { ActionLogger } from '../infrastructure/action-logger';
import { map } from 'rxjs/operators';
import { GameStateValidator } from '../infrastructure/game- state-message-validator';
import { GameRules } from '../../shared/model/v1/rules';
import { ReadyWorld, LostWorld } from '../../shared/model/v1/world';

export async function runMap(testMap: GameState, options?: {
  watcher?: null | ((state: GameState) => string | number | boolean),
  rules?: GameRules
}): Promise<GameState> {

  let container = new Container({
    defaultScope: "Singleton"
  });

  container.bind(Clock).toConstantValue(new Clock(0));
  container.bind(Logger).toSelf();
  container.bind(ActionLogger).toSelf();
  // container.bind(Logger).to(TestLogger);
  container.bind(RandomNumberGenerator).to(NotSoRandomNumberGenerator);
  container.bind(Store).toSelf();
  container.bind(ReadonlyStore).toSelf();
  container.bind(Game).toSelf();
  container.bind(GameSetupProvider).toSelf();
  container.bind(GameStateValidator).toSelf();

  const setup = container.get(GameSetupProvider);
  setup.rules = (options && options.rules) || testRules;
  setup.initialState = testMap;
  setup.endGameLoopWhenNoEventIsQueued = true;
  setup.awaitClock = false;

  registerEventQueues(container);
  registerProjectors(container);

  const store = container.get(Store);

  await store.initialize();

  const clock = container.get(Clock);

  store.commit(clock.getTimestamp());

  if (options && options.watcher) {
    const logger = container.get(Logger);
    store.state$.pipe(
      map(options.watcher)
    ).subscribe(message => {
      logger.debug(`watcher: ${message}`)
    })
  }

  const game = container.get(Game);

  return await game.startGameLoop();

}

export const dummyReadyWorld: ReadyWorld = {
  status: 'READY',
  id: "",
  industry: 0,
  metal: 10,
  mines: 1,
  ownerId: "",
  population: 25,
  populationLimit: 25,
  ships: 20,
  orders: [],
  integrity: 1,
  combatStatus: 'AT_PEACE',
  miningStatus: 'NOT_MINING',
  populationGrowthStatus: 'NOT_GROWING',
  captureStatus: 'NOT_BEING_CAPTURED'
}

export const dummyLostWorld: LostWorld = {
  status: 'LOST',
  id: "w1",
  industry: 0,
  metal: 10,
  mines: 1,
  population: 25,
  populationLimit: 25,
  ships: 20,
  orders: [],
  integrity: 1,
  captureStatus: 'NOT_BEING_CAPTURED'
}
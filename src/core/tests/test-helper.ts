import { State, INITIAL_STATE } from "../state";
import { Clock } from "../infrastructure/clock";
import { Game } from "../game";
import { Logger, TestLogger } from "../infrastructure/logger";
import { Store, ReadonlyStore } from "../store";
import { Container } from "inversify";
import { CONFIG } from "../config";
import { testConfig } from "./test-config";
import { registerEventQueues } from "../events/register-queues";
import { registerProjectors } from "../projectors/register-projectors";
import { RandomNumberGenerator, NotSoRandomNumberGenerator } from "../infrastructure/random-number-generator";

export function runMap(map: State): Promise<State> {

  let container = new Container({
    defaultScope: "Request"
  });

  container.bind(Clock).toConstantValue(new Clock(0));
  container.bind(Logger).toSelf();
  // container.bind(Logger).to(TestLogger);
  container.bind(RandomNumberGenerator).to(NotSoRandomNumberGenerator);
  container.bind(Store).toSelf();
  container.bind(ReadonlyStore).toSelf();
  container.bind(Game).toSelf();
  container.bind(CONFIG).toConstantValue(testConfig);
  container.bind(INITIAL_STATE).toConstantValue(map);

  registerEventQueues(container);
  registerProjectors(container);

  const game = container.get(Game);

  return game.startGameLoop();
  
}
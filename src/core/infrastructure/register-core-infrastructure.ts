import { Container } from "inversify";
import { Clock } from "./clock";
import { ActionLogger } from "./action-logger";
import { RandomNumberGenerator } from "./random-number-generator";
import { Logger } from "./logger";

export function registerCoreInfrastructure(container: Container) {
  container.bind(Clock).toConstantValue(new Clock(0));
  container.bind(Logger).toSelf();
  container.bind(ActionLogger).toSelf();
  container.bind(RandomNumberGenerator).toSelf();
}
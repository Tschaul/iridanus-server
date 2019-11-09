import { Container } from "inversify";
import { CreateGameExecutor } from "./create-game-executor";

export function registerCommandExecutors(container: Container) {
  container.bind(CreateGameExecutor).toSelf();
}
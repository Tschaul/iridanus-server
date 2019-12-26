import { Container } from "inversify";
import { CreateGameExecutor } from "./game-setup/create-game-executor";
import { SignUpUserExecutor } from "./authentication/sign-up-user-executor";

export function registerGameCommandExecutors(container: Container) {
  container.bind(CreateGameExecutor).toSelf();
}
export function registerGlobalCommandExecutors(container: Container) {
  container.bind(SignUpUserExecutor).toSelf();
}
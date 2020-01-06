import { Container } from "inversify";
import { CreateGameExecutor } from "./game-setup/create-game-executor";
import { SignUpUserExecutor } from "./authentication/sign-up-user-executor";
import { registerGameSetupCommandExecutors } from "./game-setup/game-setup command-executor-registry";

export function registerGameCommandExecutors(container: Container) {
}
export function registerGlobalCommandExecutors(container: Container) {
  registerGameSetupCommandExecutors(container);
  container.bind(SignUpUserExecutor).toSelf();
}
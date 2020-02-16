import { Container } from "inversify";
import { SignUpUserExecutor } from "./authentication/sign-up-user-executor";
import { registerGameSetupCommandExecutors } from "./game-setup/game-setup-command-executor-registry";
import { registerOrderCommandExecutors } from "./orders/order-command-executor-registry";

export function registerGameCommandExecutors(container: Container) {
}
export function registerGlobalCommandExecutors(container: Container) {
  registerGameSetupCommandExecutors(container);
  registerOrderCommandExecutors(container);
  container.bind(SignUpUserExecutor).toSelf();
}
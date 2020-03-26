import { Container } from "inversify";
import { SignUpUserExecutor } from "./authentication/sign-up-user-executor";
import { registerGameSetupCommandExecutors } from "./game-setup/game-setup-command-executor-registry";
import { registerOrderCommandExecutors } from "./orders/order-command-executor-registry";
import { registerNotificationCommandExecutors } from "./notifications/notifications-command-executor-registry";

export function registerGameCommandExecutors(container: Container) {
  registerNotificationCommandExecutors(container);
  registerOrderCommandExecutors(container);
}
export function registerGlobalCommandExecutors(container: Container) {
  registerGameSetupCommandExecutors(container);
  container.bind(SignUpUserExecutor).toSelf();
}
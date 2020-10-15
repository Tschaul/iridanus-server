import { Container } from "inversify";
import { AccountConfirmationMessage } from "./account-confirmation-message";
import { PasswordResetMessage } from "./password-reset-message";
import { NotificationMessage } from "./notification-message";
import { NotificationMessageHandler } from "./notification-message-handler";
import { GameIsReadyMessage } from "./game-is-ready-message";

export function registerMessages(container: Container) {
  container.bind(AccountConfirmationMessage).toSelf();
  container.bind(PasswordResetMessage).toSelf();
  container.bind(NotificationMessage).toSelf();
  container.bind(GameIsReadyMessage).toSelf();
}

export function registerGameMailHandler(container: Container) {
  container.bind(NotificationMessageHandler).toSelf();
}
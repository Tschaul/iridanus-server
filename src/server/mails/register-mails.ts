import { Container } from "inversify";
import { AccountConfirmationMail } from "./account-confirmation-mail";
import { PasswordResetMail } from "./password-reset-mail";
import { NotificationMail } from "./notification-mail";
import { NotificationMailer } from "./notification-mail-handler";
import { GameIsReadyMail } from "./game-is-ready-mail";

export function registerMails(container: Container) {
  container.bind(AccountConfirmationMail).toSelf();
  container.bind(PasswordResetMail).toSelf();
  container.bind(NotificationMail).toSelf();
  container.bind(GameIsReadyMail).toSelf();
}

export function registerGameMailHandler(container: Container) {
  container.bind(NotificationMailer).toSelf();
}
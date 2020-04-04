import { Container } from "inversify";
import { AccountConfirmationMail } from "./account-confirmation-mail";
import { PasswordResetMail } from "./password-reset-mail";

export function registerMails(container: Container) {
  container.bind(AccountConfirmationMail).toSelf();
  container.bind(PasswordResetMail).toSelf();
}
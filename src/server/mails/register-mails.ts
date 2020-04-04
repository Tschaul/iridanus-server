import { Container } from "inversify";
import { AccountConfirmationMail } from "./account-confirmation-mail";

export function registerMails(container: Container) {
  container.bind(AccountConfirmationMail).toSelf();
}
import { ContainerRegistry } from "../../../container-registry";
import { Command } from "../../../../shared/messages/commands/commands";
import { CommandExecutor } from "../command-executor";
import { Container } from "inversify";
import { SignUpUserExecutor } from "./sign-up-user-executor";
import { ConfirmEmailAddressExecutor } from "./confirm-email-address-executor";
import { ResetPasswordExecutor } from "./reset-password-executor";
import { SendPasswordResetTokenExecutor } from "./send-password-reset-token-executor";

export function getAuthenticationCommandExecutor(registry: ContainerRegistry, command: Command): CommandExecutor<Command> {
  const container = registry.globalContainer;
  switch (command.type) {
    case 'USER/SIGN_UP_USER':
      return container.get(SignUpUserExecutor) as CommandExecutor<Command>;
    case 'USER/CONFIRM_EMAIL_ADDRESS':
      return container.get(ConfirmEmailAddressExecutor) as CommandExecutor<Command>;
    case 'USER/SEND_PASSWORD_RESET_TOKEN':
      return container.get(SendPasswordResetTokenExecutor) as CommandExecutor<Command>;
    case 'USER/RESET_PASSWORD':
      return container.get(ResetPasswordExecutor) as CommandExecutor<Command>;
  }

  throw new Error('No command executor found for command type: ' + command.type)
}


export function registerAuthenticationCommandExecutors(container: Container) {
  container.bind(SignUpUserExecutor).toSelf();
  container.bind(ConfirmEmailAddressExecutor).toSelf();
  container.bind(ResetPasswordExecutor).toSelf();
  container.bind(SendPasswordResetTokenExecutor).toSelf();
}
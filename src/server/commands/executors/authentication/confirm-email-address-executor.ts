import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UserRepository } from "../../../repositories/users/user-repository";
import { SignUpUserCommand, ConfirmEmailAddressCommand } from "../../../../shared/messages/commands/user-commands";
import { AccountConfirmationMessage } from "../../../messages/account-confirmation-message";

@injectable()
export class ConfirmEmailAddressExecutor implements CommandExecutor<ConfirmEmailAddressCommand> {
  authenticationRequired = false;
  
  constructor(private userRepository: UserRepository) {
  }

  async execute(command: ConfirmEmailAddressCommand) {
    await this.userRepository.confirmUserEmail(command.id, command.token);
  }

}
import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UserRepository } from "../../../repositories/users/user-repository";
import { SignUpUserCommand } from "../../../../shared/messages/commands/user-commands";
import { AccountConfirmationMessage } from "../../../messages/account-confirmation-message";

@injectable()
export class SignUpUserExecutor implements CommandExecutor<SignUpUserCommand> {
  authenticationRequired = false;
  
  constructor(private userRepository: UserRepository, private confirmationMail: AccountConfirmationMessage) {
  }

  async execute(command: SignUpUserCommand) {

    const token = await this.userRepository.createUser(command.id, command.email, command.password);

    await this.confirmationMail.send(command.id, token)
  }

}
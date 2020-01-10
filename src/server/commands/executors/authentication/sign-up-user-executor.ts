import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UserRepository } from "../../../repositories/users/user-repository";
import { SignUpUserCommand } from "../../../../shared/messages/commands/user-commands";

@injectable()
export class SignUpUserExecutor implements CommandExecutor<SignUpUserCommand> {
  authenticationRequired = false;
  
  constructor(private userRepository: UserRepository) {
  }

  async execute(command: SignUpUserCommand) {

    await this.userRepository.createUser(command.id, command.email, command.password);

  }

}
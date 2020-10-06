import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UserRepository } from "../../../repositories/users/user-repository";
import { RemoveAuthTokenCommand } from "../../../../shared/messages/commands/user-commands";

@injectable()
export class RemoveAuthTokenCommandExecutor implements CommandExecutor<RemoveAuthTokenCommand> {
  authenticationRequired = false;
  
  constructor(private userRepository: UserRepository) {
  }

  async execute(command: RemoveAuthTokenCommand, userId: string) {
    await this.userRepository.removeToken(userId, command.token);
  }

}
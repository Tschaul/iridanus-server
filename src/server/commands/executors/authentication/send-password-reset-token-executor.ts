import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UserRepository } from "../../../repositories/users/user-repository";
import { SendPasswordResetTokenCommand } from "../../../../shared/messages/commands/user-commands";
import { PasswordResetMail } from "../../../mails/password-reset-mail";

@injectable()
export class SendPasswordResetTokenExecutor implements CommandExecutor<SendPasswordResetTokenCommand> {
  authenticationRequired = false;

  constructor(private userRepository: UserRepository, private resetPasswordMail: PasswordResetMail) {
  }

  async execute(command: SendPasswordResetTokenCommand) {
    const token = await this.userRepository.renewPasswordResetToken(command.id);
    await this.resetPasswordMail.send(command.id, token);
  }

}
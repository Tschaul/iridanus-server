import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UserRepository } from "../../../repositories/users/user-repository";
import { ResetPasswordCommand } from "../../../../shared/messages/commands/user-commands";
import { PasswordResetMail } from "../../../mails/password-reset-mail";

@injectable()
export class ResetPasswordExecutor implements CommandExecutor<ResetPasswordCommand> {
  authenticationRequired = false;

  constructor(private userRepository: UserRepository, private resetPasswordMail: PasswordResetMail) {
  }

  async execute(command: ResetPasswordCommand) {
    await this.userRepository.resetPassword(command.id, command.token, command.password);
  }

}
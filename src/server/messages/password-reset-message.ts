import { injectable } from "inversify";
import { MailSender } from "../infrastructure/message-sending/mail-sender";
import { Environment } from "../environment/environment";
import { MessageRouter } from "../infrastructure/message-sending/message-router";

@injectable()
export class PasswordResetMessage {

  constructor(private messageRouter: MessageRouter, private environment: Environment) {}

  async send(recipient: string, token: string) {
    await this.messageRouter.send({
      recipients: [recipient],
      subject: 'Your Iridanus account',
      text: 
`Hi

you requested a password reset. Follow the link below to proceed:

${this.environment.baseUrl}#reset-password/${recipient}/${token}`
    })
  }
}
import { injectable } from "inversify";
import { Environment } from "../environment/environment";
import { MessageRouter } from "../infrastructure/message-sending/message-router";

@injectable()
export class AccountConfirmationMessage {

  constructor(private messageRouter: MessageRouter, private environment: Environment) {}

  async send(recipient: string, token: string) {
    await this.messageRouter.send({
      recipients: [recipient],
      subject: 'Your Iridanus account',
      text: 
`Welcome to Iridanus

please use the following link to activate you account and login:

${this.environment.baseUrl}#confirm-email/${recipient}/${token}`
    })
  }
}
import { injectable } from "inversify";
import { MailSender } from "../infrastructure/mail/mail-sender";
import { Environment } from "../environment/environment";

@injectable()
export class AccountConfirmationMail {

  constructor(private mailSender: MailSender, private environment: Environment) {}

  async send(recipient: string, token: string) {
    await this.mailSender.send({
      recipients: [recipient],
      subject: 'Your Iridanus account',
      text: 
`Welcome to Iridanus

please click the following link to activate you account and login:

${this.environment.baseUrl}#confirm/${recipient}/${token}`
    })
  }
}
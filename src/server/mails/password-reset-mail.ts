import { injectable } from "inversify";
import { MailSender } from "../infrastructure/mail/mail-sender";
import { Environment } from "../environment/environment";

@injectable()
export class PasswordResetMail {

  constructor(private mailSender: MailSender, private environment: Environment) {}

  async send(recipient: string, token: string) {
    await this.mailSender.send({
      recipients: [recipient],
      subject: 'Your Iridanus account',
      text: 
`Hi

you requested a password reset. Follow the link below to proceed:

${this.environment.baseUrl}#reset-password/${recipient}/${token}`
    })
  }
}
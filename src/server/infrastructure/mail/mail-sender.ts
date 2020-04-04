import { injectable } from "inversify";
import { createTransport, getTestMessageUrl } from "nodemailer";
import { Environment } from "../../environment/environment";
import Mail from "nodemailer/lib/mailer";
import { UserRepository } from "../../repositories/users/user-repository";
import { Logger } from "../../../core/infrastructure/logger";

export interface MailPayload {
  recipients: string[]
  subject: string,
  text: string,
  html?: string,
}

@injectable()
export class MailSender {
  transporter: Mail;
  constructor(private environment: Environment, private userRepository: UserRepository, private logger: Logger) {
    this.transporter = createTransport({
      host: environment.mailSettings.host,
      port: environment.mailSettings.port,
      secure: environment.mailSettings.secure,
      auth: {
        user: environment.mailSettings.username,
        pass: environment.mailSettings.password
      }
    })
  }

  async send(mail: MailPayload) {

    const userInfos = await this.userRepository.getUserInfos(mail.recipients);
    const to = userInfos.map(it => it.email).join(', ');

    const info = await this.transporter.sendMail({
      from: this.environment.mailSettings.fromAddress,
      to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    })

    this.logger.info("Message sent: " + info.messageId);

    if (this.environment.mailSettings.useTestAccount) {
      this.logger.info("Preview URL: " + getTestMessageUrl(info));
    }
  }
}
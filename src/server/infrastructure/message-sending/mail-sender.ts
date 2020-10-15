import { injectable } from "inversify";
import { createTransport, getTestMessageUrl } from "nodemailer";
import { Environment } from "../../environment/environment";
import { UserRepository } from "../../repositories/users/user-repository";
import { Logger } from "../../../core/infrastructure/logger";
import { MessagePayload } from "./message-payload";

@injectable()
export class MailSender {
  constructor(private environment: Environment, private userRepository: UserRepository, private logger: Logger) {
  }

  async send(mail: MessagePayload) {

    const transporter = createTransport({
      host: this.environment.mailSettings.host,
      port: this.environment.mailSettings.port,
      secure: this.environment.mailSettings.secure,
      auth: {
        user: this.environment.mailSettings.username,
        pass: this.environment.mailSettings.password
      }
    })

    const userInfos = await this.userRepository.getUserInfos(mail.recipients);

    for (const userInfo of userInfos) {
      
      const to = userInfo.email;

      const info = await transporter.sendMail({
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
}
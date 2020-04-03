import { injectable } from "inversify";
import { MailPayload } from "./mails";
import { createTransport, getTestMessageUrl } from "nodemailer";
import { Environment } from "../../environment/environment";
import Mail from "nodemailer/lib/mailer";
import { UserRepository } from "../../repositories/users/user-repository";

@injectable()
export class MailSender {
  transporter: Mail;
  constructor(private environment: Environment, private userRepository: UserRepository) {
    this.transporter = createTransport({
      host: environment.mailSettings.host,
      port: environment.mailSettings.port,
      secure: environment.mailSettings.secure, // true for 465, false for other ports
      auth: {
        user: environment.mailSettings.username, // generated ethereal user
        pass: environment.mailSettings.password // generated ethereal password
      }
    })
  }

  async send(mail: MailPayload) {

    const userInfos = await this.userRepository.getUserInfos(mail.recipients);
    const to = userInfos.map(it => it.email).join(', ');

    const info = await this.transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>" // html body
    })

    console.log("Message sent: %s", info.messageId);

    if (this.environment.mailSettings.useTestAccount) {
      console.log("Preview URL: %s", getTestMessageUrl(info));
    }
  }
}
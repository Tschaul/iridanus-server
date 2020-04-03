export class Environment {
  dataPath: string;
  millisecondsPerDay: number;
  mailSettings: MailSettings
}

export interface MailSettings {
  useTestAccount: boolean,
  host: string,
  port: number,
  secure: boolean,
  username: string,
  password: string
}
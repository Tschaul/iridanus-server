import { Container } from "inversify";
import { Environment, MailSettings } from "./environment";
import { createTestAccount } from 'nodemailer'

export function registerEnvironment(container: Container) {
  container.bind(Environment).toConstantValue(extractEnvironment())
}

function extractEnvironment() {
  const useTestMailAccount = envBoolean('IRIDANUS_USE_TEST_EMAIL_ACCOUNT');

  const mailSettings: MailSettings = useTestMailAccount ? {
    useTestAccount: true,
    fromAddress: envString('IRIDANUS_MAIL_FROM_ADDRESS', true),
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    ...undefined as any
  } : {
      useTestAccount: false,
      fromAddress: envString('IRIDANUS_MAIL_FROM_ADDRESS', true),
      host: envString('IRIDANUS_MAIL_SERVER_HOST', true),
      port: envNumber('IRIDANUS_MAIL_SERVER_PORT', true),
      secure: envBoolean('IRIDANUS_MAIL_SERVER_SECURE', true),
      username: envString('IRIDANUS_MAIL_SERVER_USERNAME', true),
      password: envString('IRIDANUS_MAIL_SERVER_PASSWORD', true)
    }

  const environment: Environment = {
    dataPath: envString('IRIDANUS_DATA_PATH', true),
    millisecondsPerDay: envNumber('IRIDANUS_MILLISECONDS_PER_DAY', true),
    mailSettings,
    baseUrl: envString('IRIDANUS_BASE_URL'),
    developmentMode: envBoolean('IRIDANUS_DEVELOPMENT_MODE')
  }

  if (useTestMailAccount) {
    createTestAccount().then(testAccount => {
      console.log('Email testaccount arrived.')
      environment.mailSettings.username = testAccount.user;
      environment.mailSettings.password = testAccount.pass;
    })
  }

  return environment;
}



function envString(variable: string, required = false): string {
  if (!process.env[variable] && required) {
    throw new Error("Missing environment variable: " + variable)
  } else {
    return process.env[variable] || '';
  }
}

function envNumber(variable: string, required = false): number {
  if (!process.env[variable] && required) {
    throw new Error("Missing environment variable: " + variable)
  } else {
    return parseInt(process.env[variable] || '0');
  }
}

function envBoolean(variable: string, required = false): boolean {
  if (!process.env[variable] && required) {
    throw new Error("Missing environment variable: " + variable)
  } else {
    return process.env[variable]?.toLowerCase() === 'true';
  }
}
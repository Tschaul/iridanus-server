export type MailPayload = HelloWorldMail;

export interface MailBase {
  recipients: string[]
}

export interface HelloWorldMail extends MailBase {
  type: 'HELLO_WORLD'
}
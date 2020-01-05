import { SubscriptionResult } from "./subscription-result";

export type ResponseMessage = {
  type: 'AUTHENTICATION_SUCCESSFULL'
} | {
  type: 'ERROR',
  error: string,
  commandId?: string,
} | {
  type: 'COMMAND_SUCCESS',
  commandId: string,
} | {
  type: 'SUBSCRIPTION_RESULT'
  result: SubscriptionResult,
  id: string,
}
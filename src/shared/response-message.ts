import { SubscriptionResult } from "./subscription-result";

export type ResponseMessage = {
  type: 'ERROR',
  error: string,
} | {
  type: 'SUBSCRIPTION_RESULT'
  result: SubscriptionResult,
  id: string,
}
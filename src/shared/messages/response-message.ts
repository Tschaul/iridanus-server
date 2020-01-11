import { SubscriptionResult } from "./subscription-result";

export interface AuthenticationResponse {
  type: 'AUTHENTICATION_SUCCESSFULL' | 'AUTHENTICATION_NOT_SUCCESSFULL'
}

export interface ErrorReponse {
  type: 'ERROR',
  error: string,
  commandId?: string,
}

export interface CommandResponse {
  type: 'COMMAND_SUCCESS',
  commandId: string,
}

export interface SubscriptionResponse {
  type: 'SUBSCRIPTION_RESULT'
  result: SubscriptionResult,
  id: string,
}

export type ResponseMessage = AuthenticationResponse
  | ErrorReponse
  | CommandResponse
  | SubscriptionResponse
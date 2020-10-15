export type EnvironmentSubscriptionResult = EnvironmentInfoSubscriptionResult;

export type EnvironmentInfo = {
  millisecondsPerDay: number;
  developmentMode: boolean;
  telegramBotName: string;
};

export interface EnvironmentInfoSubscriptionResult {
  type: 'ENVIRONMENT/INFO',
  info: EnvironmentInfo
}
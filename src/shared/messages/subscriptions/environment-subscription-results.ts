export type EnvironmentSubscriptionResult = EnvironmentInfoSubscriptionResult;

export type EnvironmentInfo = {
  millisecondsPerDay: number;
  developmentMode: boolean;
};

export interface EnvironmentInfoSubscriptionResult {
  type: 'ENVIRONMENT/INFO',
  info: EnvironmentInfo
}
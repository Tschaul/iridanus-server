export type EnvironmentSubscriptionResult = EnvironmentInfoSubscriptionResult;

export type EnvironmentInfo = {
  millisecondsPerDay: number;
};

export interface EnvironmentInfoSubscriptionResult {
  type: 'ENVIRONMENT/INFO',
  info: EnvironmentInfo
}